signed int __cdecl ProtoSSLUpdateSendClientKey(int a1)
{
  _DWORD *v1; // ebp
  size_t v2; // ST3C_4
  size_t v3; // ST34_4
  int v4; // ebx
  int v5; // esi
  char v6; // al
  size_t v7; // edi
  int v8; // ebx
  int v9; // ecx
  int v10; // eax
  int v11; // eax
  int v12; // eax
  int v13; // eax
  size_t v14; // ST40_4
  int v16; // [esp+10h] [ebp-9D0h]
  int v17; // [esp+14h] [ebp-9CCh]
  char v18; // [esp+70h] [ebp-970h]
  char Dst; // [esp+CCh] [ebp-914h]
  char v20; // [esp+CDh] [ebp-913h]
  char v21; // [esp+CEh] [ebp-912h]
  int v22; // [esp+1CCh] [ebp-814h]
  char v23; // [esp+1D4h] [ebp-80Ch]

  v1 = *(_DWORD **)(a1 + 296);
  sub_B168F0(48);
  v2 = v1[1166];
  v3 = v1[1037];
  *((_BYTE *)v1 + 104) = 3;
  *((_BYTE *)v1 + 105) = 0;
  CryptRSAInit((int)&v22, v1 + 1038, v3, v1 + 1167, v2);
  CryptRSAInitMaster(&v22, (int)(v1 + 26), 0x30u);
  CryptRSAEncrypt(&v22);
  v4 = 0;
  v5 = (int)(v1 + 38);
  do
  {
    CryptMD5Init(&v18);
    CryptMD5Update(&v18, v1 + 26, 0x30u);
    CryptSha1Init(&v17);
    v6 = v4++ + 65;
    v21 = v6;
    v20 = v6;
    Dst = v6;
    CryptSha1Update((int)&v17, &Dst, v4);
    CryptSha1Update((int)&v17, v1 + 26, 48);
    CryptSha1Update((int)&v17, v1 + 10, 32);
    CryptSha1Update((int)&v17, v1 + 18, 32);
    CryptSha1Final(&v17, &Dst, 20);
    CryptMD5Update(&v18, &Dst, 0x14u);
    CryptMD5Final(&v18, v5, 16);
    v5 += 16;
  }
  while ( v4 < 3 );
  memset(v1 + 26, 0, 0x30u);
  v7 = 1;
  v8 = (int)(v1 + 50);
  v16 = 12;
  do
  {
    CryptMD5Init(&v18);
    CryptMD5Update(&v18, v1 + 38, 0x30u);
    CryptSha1Init(&v17);
    memset(&Dst, v7 + 64, v7);
    CryptSha1Update((int)&v17, &Dst, v7);
    CryptSha1Update((int)&v17, v1 + 38, 48);
    CryptSha1Update((int)&v17, v1 + 18, 32);
    CryptSha1Update((int)&v17, v1 + 10, 32);
    CryptSha1Final(&v17, &Dst, 20);
    CryptMD5Update(&v18, &Dst, 0x14u);
    CryptMD5Final(&v18, v8, 16);
    ++v7;
    v8 += 16;
    --v16;
  }
  while ( v16 );
  v9 = v1[9];
  v1[99] = v1 + 50;
  v10 = (int)v1 + *(unsigned __int8 *)(v9 + 5) + 200;
  v1[98] = v10;
  v11 = *(unsigned __int8 *)(v9 + 5) + v10;
  v1[101] = v11;
  v12 = *(unsigned __int8 *)(v9 + 3) + v11;
  v1[100] = v12;
  v13 = *(unsigned __int8 *)(v9 + 3) + v12;
  v1[103] = v13;
  v1[102] = v13 + 16;
  v14 = v1[1037];
  BYTE2(v16) = *((_WORD *)v1 + 2074) >> 8;
  LOWORD(v16) = 16;
  HIBYTE(v16) = v14;
  SendPacket(4u, &v16, a1, 22, &v23, v14);
  return 23;
}