﻿using System;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Net.Sockets;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using BlazeLibWV;

namespace BlazeSharkWV
{
    public partial class Form1 : Form
    {
        public readonly object _sync = new object();
        public bool _exit;
        public TcpListener listener = null;
        public List<Blaze.Packet> packets = new List<Blaze.Packet>();
        public int packetCount = 0;
        public List<Blaze.Tdf> inlist;
        public int inlistcount;

        public Form1()
        {
            InitializeComponent();
        }

        private void toolStripButton1_Click(object sender, EventArgs e)
        {
            toolStripButton1.Enabled = false;
            SetExit(false);
            new Thread(tProxyMain).Start();
        }

        public void tProxyMain(object obj)
        {
            try
            {
                Log("Starting...");
                int port = Convert.ToInt32(toolStripTextBox1.Text);
                int portTarget = Convert.ToInt32(toolStripTextBox2.Text);
                listener = new TcpListener(IPAddress.Parse(toolStripTextBox3.Text), port);
                Log("Bind to port " + port);
                listener.Start();
                Log("Listening...");
                TcpClient client;
                byte[] data;
                while (!GetExit())
                {
                    try
                    {
                        client = listener.AcceptTcpClient();
                        Log("Client connected");
                        TcpClient target = new TcpClient("127.0.0.1", portTarget);
                        Log("Target connected");
                        NetworkStream nsc = client.GetStream();
                        NetworkStream nst = target.GetStream();
                        while (client.Connected && target.Connected && !GetExit())
                        {
                            data = ReadContentTCP(nsc);
                            if (data.Length != 0)
                            {
                                Log("Received " + data.Length + " bytes of data from client");
                                nst.Write(data, 0, data.Length);
                                nst.Flush();
                                AddPacket(data);
                            }
                            data = ReadContentTCP(nst);
                            if (data.Length != 0)
                            {
                                Log("Received " + data.Length + " bytes of data from target");
                                nsc.Write(data, 0, data.Length);
                                nsc.Flush();
                                AddPacket(data);
                            }
                            Thread.Sleep(10);
                        }
                        target.Close();
                        Log("Target disconnected");
                        client.Close();
                        Log("Client disconnected");
                    }
                    catch (Exception ex)
                    {
                        string err = ex.Message;
                        if (ex.InnerException != null)
                            err += " - " + ex.InnerException.Message;
                        Log("ERROR : " + err);
                    }
                }
            }
            catch (Exception ex)
            {
                string err = ex.Message;
                if (ex.InnerException != null)
                    err += " - " + ex.InnerException.Message;
                Log("ERROR : " + err);
            }
            toolStripButton1.Enabled = true;
        }

        public static byte[] ReadContentTCP(NetworkStream Stream)
        {
            MemoryStream res = new MemoryStream();
            byte[] buff = new byte[0x10000];
            int bytesRead;
            Stream.ReadTimeout = 20;
            try
            {
                while ((bytesRead = Stream.Read(buff, 0, 0x10000)) > 0)
                    res.Write(buff, 0, bytesRead);
            }
            catch { }
            Stream.Flush();
            return res.ToArray();
        }

        public void SetExit(bool state)
        {
            lock (_sync)
            {
                _exit = state;
            }
        }

        public bool GetExit()
        {
            bool result;
            lock (_sync)
            {
                result = _exit;
            }
            return result;
        }

        public void AddPacket(byte[] data)
        {
            MemoryStream m = new MemoryStream(data);
            m.Seek(0, 0);
            List<Blaze.Packet> result = Blaze.FetchAllBlazePackets(m);
            lock (_sync)
            {
                packets.AddRange(result);
            }
        }


        public void Log(string s)
        {
            try
            {
                rtb1.Invoke(new Action(delegate
                {
                    string stamp = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToLongTimeString() + " : ";
                    rtb1.Text += stamp + s + "\n";
                    rtb1.SelectionStart = rtb1.Text.Length;
                    rtb1.ScrollToCaret();
                }));
            }
            catch { }
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            SetExit(true);
            if (listener != null)
                listener.Stop();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            bool update = false;
            lock (_sync)
            {
                if (packets.Count != packetCount)
                {
                    update = true;
                    packetCount = packets.Count;
                }
            }
            if (update)
            {
                listBox1.Items.Clear();
                lock (_sync)
                {
                    foreach (Blaze.Packet p in packets)
                        listBox1.Items.Add(p.Length.ToString("X4") + " " +
                                           p.Component.ToString("X4") + " " +
                                           p.Command.ToString("X4") + " " +
                                           p.Error.ToString("X4") + " " +
                                           p.QType.ToString("X4") + " " +
                                           p.ID.ToString("X4") + " " +
                                           p.extLength.ToString("X4") + " " + Blaze.PacketToDescriber(p));
                }
            }
        }

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            int n = listBox1.SelectedIndex;
            if (n == -1) return;
            Blaze.Packet p;
            lock (_sync)
            {
                p = packets[n];
            }
            tv1.Nodes.Clear();
            inlistcount = 0;
            inlist = new List<Blaze.Tdf>();
            List<Blaze.Tdf> Fields = Blaze.ReadPacketContent(p);
            foreach (Blaze.Tdf tdf in Fields)
                tv1.Nodes.Add(TdfToTree(tdf));
        }

        private TreeNode TdfToTree(Blaze.Tdf tdf)
        {
            TreeNode t, t2, t3;
            switch (tdf.Type)
            {
                case 3:
                    t = tdf.ToTree();
                    Blaze.TdfStruct str = (Blaze.TdfStruct)tdf;
                    if (str.startswith2)
                        t.Text += " (Starts with 2)";
                    foreach (Blaze.Tdf td in str.Values)
                        t.Nodes.Add(TdfToTree(td));
                    t.Name = (inlistcount++).ToString();
                    inlist.Add(tdf);
                    return t;
                case 4:
                    t = tdf.ToTree();
                    Blaze.TdfList l = (Blaze.TdfList)tdf;
                    if (l.SubType == 3)
                    {
                        List<Blaze.TdfStruct> l2 = (List<Blaze.TdfStruct>)l.List;
                        for (int i = 0; i < l2.Count; i++)
                        {
                            t2 = new TreeNode("Entry #" + i);
                            if (l2[i].startswith2)
                                t2.Text += " (Starts with 2)";
                            List<Blaze.Tdf> l3 = l2[i].Values;
                            for (int j = 0; j < l3.Count; j++)
                                t2.Nodes.Add(TdfToTree(l3[j]));
                            t.Nodes.Add(t2);
                        }
                    }
                    t.Name = (inlistcount++).ToString();
                    inlist.Add(tdf);
                    return t;
                case 5:
                    t = tdf.ToTree();
                    Blaze.TdfDoubleList ll = (Blaze.TdfDoubleList)tdf;
                    t2 = new TreeNode("List 1");
                    if (ll.SubType1 == 3)
                    {
                        List<Blaze.TdfStruct> l2 = (List<Blaze.TdfStruct>)ll.List1;
                        for (int i = 0; i < l2.Count; i++)
                        {
                            t3 = new TreeNode("Entry #" + i);
                            if (l2[i].startswith2)
                                t2.Text += " (Starts with 2)";
                            List<Blaze.Tdf> l3 = l2[i].Values;
                            for (int j = 0; j < l3.Count; j++)
                                t3.Nodes.Add(TdfToTree(l3[j]));
                            t2.Nodes.Add(t3);
                        }
                        t.Nodes.Add(t2);
                    }
                    t2 = new TreeNode("List 2");
                    if (ll.SubType2 == 3)
                    {
                        List<Blaze.TdfStruct> l2 = (List<Blaze.TdfStruct>)ll.List2;
                        for (int i = 0; i < l2.Count; i++)
                        {
                            t3 = new TreeNode("Entry #" + i);
                            if (l2[i].startswith2)
                                t2.Text += " (Starts with 2)";
                            List<Blaze.Tdf> l3 = l2[i].Values;
                            for (int j = 0; j < l3.Count; j++)
                                t3.Nodes.Add(TdfToTree(l3[j]));
                            t2.Nodes.Add(t3);
                        }
                        t.Nodes.Add(t2);
                    }
                    t.Name = (inlistcount++).ToString();
                    inlist.Add(tdf);
                    return t;
                case 6:
                    t = tdf.ToTree();
                    Blaze.TdfUnion tu = (Blaze.TdfUnion)tdf;
                    if (tu.UnionType != 0x7F)
                    {
                        t.Nodes.Add(TdfToTree(tu.UnionContent));
                    }
                    t.Name = (inlistcount++).ToString();
                    inlist.Add(tdf);
                    return t;
                default:
                    t = tdf.ToTree();
                    t.Name = (inlistcount++).ToString();
                    inlist.Add(tdf);
                    return t;
            }
        }

        private void tv1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            TreeNode t = e.Node;
            if (t != null && t.Name != "")
            {
                int n = Convert.ToInt32(t.Name);
                Blaze.Tdf tdf = inlist[n];
                string s;
                switch (tdf.Type)
                {
                    case 0:
                        Blaze.TdfInteger ti = (Blaze.TdfInteger)tdf;
                        rtb2.Text = "0x" + ti.Value.ToString("X");
                        if (ti.Label == "IP  ")
                        {
                            rtb2.Text += Environment.NewLine + "(" + Blaze.GetStringFromIP(ti.Value) + ")";
                        }
                        break;
                    case 1:
                        rtb2.Text = ((Blaze.TdfString)tdf).Value.ToString();
                        break;
                    case 2:
                        rtb2.Text = "Length: " + ((Blaze.TdfBlob)tdf).Data.Length.ToString();
                        rtb2.Text += Environment.NewLine + Blaze.HexDump(((Blaze.TdfBlob)tdf).Data);
                        break;
                    case 4:
                        Blaze.TdfList l = (Blaze.TdfList)tdf;
                        s = "";
                        for (int i = 0; i < l.Count; i++)
                        {
                            switch (l.SubType)
                            {
                                case 0:
                                    s += "{" + ((List<long>)l.List)[i] + "} ";
                                    break;
                                case 1:
                                    s += "{" + ((List<string>)l.List)[i] + "} ";
                                    break;
                                case 9:
                                    Blaze.TrippleVal t2 = ((List<Blaze.TrippleVal>)l.List)[i];
                                    s += "{" + t2.v1.ToString("X") + "; " + t2.v2.ToString("X") + "; " + t2.v3.ToString("X") + "} ";
                                    break;
                            }
                        }
                        rtb2.Text = s;
                        break;
                    case 5:
                        s = "";
                        Blaze.TdfDoubleList ll = (Blaze.TdfDoubleList)tdf;
                        for (int i = 0; i < ll.Count; i++)
                        {
                            s += "{";
                            switch (ll.SubType1)
                            {
                                case 0:
                                    List<long> l1 = (List<long>)ll.List1;
                                    s += l1[i].ToString("X");
                                    break;
                                case 1:
                                    List<string> l2 = (List<string>)ll.List1;
                                    s += l2[i];
                                    break;
                                case 0xA:
                                    List<float> lf1 = (List<float>)ll.List1;
                                    s += lf1[i].ToString();
                                    break;
                                default:
                                    s += "(see List1[" + i + "])";
                                    break;
                            }
                            s += " ; ";
                            switch (ll.SubType2)
                            {
                                case 0:
                                    List<long> l1 = (List<long>)ll.List2;
                                    s += l1[i].ToString("X");
                                    break;
                                case 1:
                                    List<string> l2 = (List<string>)ll.List2;
                                    s += l2[i];
                                    break;
                                case 0xA:
                                    List<float> lf1 = (List<float>)ll.List2;
                                    s += lf1[i].ToString();
                                    break;
                                default:
                                    s += "(see List2[" + i + "])";
                                    break;
                            }
                            s += "}\n";
                        }
                        rtb2.Text = s;
                        break;
                    case 6:
                        rtb2.Text = "Type: 0x" + ((Blaze.TdfUnion)tdf).UnionType.ToString("X2");
                        break;
                    case 7:
                        Blaze.TdfIntegerList til = (Blaze.TdfIntegerList)tdf;
                        s = "";
                        for (int i = 0; i < til.Count; i++)
                        {
                            s += til.List[i].ToString("X");
                            if (i < til.Count - 1)
                                s += "; ";
                        }
                        rtb2.Text = s;
                        break;
                    case 8:
                        Blaze.TdfDoubleVal dval = (Blaze.TdfDoubleVal)tdf;
                        rtb2.Text = "0x" + dval.Value.v1.ToString("X") + " 0x" + dval.Value.v2.ToString("X");
                        break;
                    case 9:
                        Blaze.TdfTrippleVal tval = (Blaze.TdfTrippleVal)tdf;
                        rtb2.Text = "0x" + tval.Value.v1.ToString("X") + " 0x" + tval.Value.v2.ToString("X") + " 0x" + tval.Value.v3.ToString("X");
                        break;
                    default:
                        rtb2.Text = "";
                        break;
                }
            }
        }

        private void savePacketsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SaveFileDialog d = new SaveFileDialog();
            d.Filter = "*.bin|*.bin";
            if (d.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                MemoryStream m = new MemoryStream();
                lock (_sync)
                {
                    foreach (Blaze.Packet p in packets)
                    {
                        byte[] data = Blaze.PacketToRaw(p);
                        m.Write(data, 0, data.Length);
                    }
                }
                File.WriteAllBytes(d.FileName, m.ToArray());
                MessageBox.Show("Done.");
            }
        }

        private void loadPacketsToolStripMenuItem_Click(object sender, EventArgs e)
        {

            OpenFileDialog d = new OpenFileDialog();
            d.Filter = "*.bin|*.bin";
            if (d.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                byte[] data = File.ReadAllBytes(d.FileName);
                lock (_sync)
                {
                    packets.Clear();
                    packets.AddRange(Blaze.FetchAllBlazePackets(new MemoryStream(data)));
                    packetCount = -1;
                }
            }
        }

    }
}