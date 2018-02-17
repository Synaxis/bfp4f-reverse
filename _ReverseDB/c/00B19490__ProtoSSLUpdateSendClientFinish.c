signed int __cdecl ProtoSSLUpdateSendClientFinish(int a1)
{
  int v1; // ebx
  int v3; // [esp+10h] [ebp-1D8h]
  char Src; // [esp+14h] [ebp-1D4h]
  char Dst; // [esp+28h] [ebp-1C0h]
  int v6; // [esp+88h] [ebp-160h]
  char v7; // [esp+E8h] [ebp-100h]
  char v8; // [esp+F8h] [ebp-F0h]

  v1 = *(_DWORD *)(a1 + 296);
  qmemcpy(&Dst, (const void *)(v1 + 416), 0x5Cu);
  v3 = v1;
  CryptMD5Update(&Dst, "CLNT", 4u);
  v1 += 152;
  CryptMD5Update(&Dst, (void *)v1, 0x30u);
  CryptMD5Update(
    &Dst,
    "666666666666666666666666666666666666666666666666\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    0x30u);
  CryptMD5Final(&Dst, &Src, 16);
  CryptMD5Init(&Dst);
  CryptMD5Update(&Dst, (void *)v1, 0x30u);
  CryptMD5Update(
    &Dst,
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    0x30u);
  CryptMD5Update(&Dst, &Src, 0x10u);
  CryptMD5Final(&Dst, &v7, 16);
  qmemcpy(&v6, (const void *)(v3 + 508), 0x5Cu);
  CryptSha1Update((int)&v6, "CLNT", 4);
  CryptSha1Update((int)&v6, (void *)v1, 48);
  CryptSha1Update(
    (int)&v6,
    "666666666666666666666666666666666666666666666666\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    40);
  CryptSha1Final(&v6, &Src, 20);
  CryptSha1Init(&v6);
  CryptSha1Update((int)&v6, (void *)v1, 48);
  CryptSha1Update(
    (int)&v6,
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    40);
  CryptSha1Update((int)&v6, &Src, 20);
  CryptSha1Final(&v6, &v8, 20);
  v3 = 603979796;
  SendPacket(4u, &v3, a1, 22, &v7, 0x24u);
  return 25;
}