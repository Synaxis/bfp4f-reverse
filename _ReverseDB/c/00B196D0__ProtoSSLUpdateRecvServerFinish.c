signed int __usercall ProtoSSLUpdateRecvServerFinish@<eax>(int a1@<eax>, _DWORD *a2)
{
  int v2; // ebx
  int v3; // ST58_4
  unsigned int v4; // edx
  _DWORD *v5; // ecx
  _DWORD *v6; // eax
  unsigned int v7; // ecx
  char Src; // [esp+14h] [ebp-FCh]
  char v10[16]; // [esp+28h] [ebp-E8h]
  int v11; // [esp+38h] [ebp-D8h]
  char Dst; // [esp+98h] [ebp-78h]
  char v13[20]; // [esp+FCh] [ebp-14h]

  v2 = *(_DWORD *)(a1 + 296);
  qmemcpy(&Dst, (const void *)(v2 + 416), 0x5Cu);
  v3 = v2;
  CryptMD5Update(&Dst, "SRVR", 4u);
  v2 += 152;
  CryptMD5Update(&Dst, (void *)v2, 0x30u);
  CryptMD5Update(
    &Dst,
    "666666666666666666666666666666666666666666666666\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    0x30u);
  CryptMD5Final(&Dst, &Src, 16);
  CryptMD5Init(&Dst);
  CryptMD5Update(&Dst, (void *)v2, 0x30u);
  CryptMD5Update(
    &Dst,
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    0x30u);
  CryptMD5Update(&Dst, &Src, 0x10u);
  CryptMD5Final(&Dst, v10, 16);
  qmemcpy(&v11, (const void *)(v3 + 508), 0x5Cu);
  CryptSha1Update((int)&v11, "SRVR", 4);
  CryptSha1Update((int)&v11, (void *)v2, 48);
  CryptSha1Update(
    (int)&v11,
    "666666666666666666666666666666666666666666666666\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    40);
  CryptSha1Final(&v11, &Src, 20);
  CryptSha1Init(&v11);
  CryptSha1Update((int)&v11, (void *)v2, 48);
  CryptSha1Update(
    (int)&v11,
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    40);
  CryptSha1Update((int)&v11, &Src, 20);
  CryptSha1Final(&v11, v13, 20);
  v4 = 16;
  v5 = a2;
  while ( *(_DWORD *)((char *)v5 + v10 - (char *)a2) == *v5 )
  {
    v4 -= 4;
    ++v5;
    if ( v4 < 4 )
    {
      v6 = a2 + 4;
      v7 = 20;
      while ( *(_DWORD *)((char *)v6 + v13 - (char *)(a2 + 4)) == *v6 )
      {
        v7 -= 4;
        ++v6;
        if ( v7 < 4 )
          return 30;
      }
      return 4102;
    }
  }
  return 4102;
}