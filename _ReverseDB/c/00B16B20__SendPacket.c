int __usercall SendPacket@<eax>(size_t a1@<eax>, const void *a2@<edx>, int a3, char a4, void *Src, size_t Size)
{
  size_t v6; // ebx
  int v7; // esi
  int v8; // edi
  signed int v9; // ebx
  signed int v10; // eax
  int v11; // eax
  char v12; // dl
  char v13; // cl
  char v14; // dl
  char v15; // dl
  size_t v16; // ebp
  char v18; // [esp+10h] [ebp-7Ch]
  char v19; // [esp+11h] [ebp-7Bh]
  char v20; // [esp+12h] [ebp-7Ah]
  char v21; // [esp+13h] [ebp-79h]
  char v22; // [esp+14h] [ebp-78h]
  char v23; // [esp+15h] [ebp-77h]
  char v24; // [esp+16h] [ebp-76h]
  char v25; // [esp+17h] [ebp-75h]
  char v26; // [esp+18h] [ebp-74h]
  char v27; // [esp+19h] [ebp-73h]
  char v28; // [esp+1Ah] [ebp-72h]
  char v29; // [esp+1Ch] [ebp-70h]
  int Dst; // [esp+30h] [ebp-5Ch]

  v6 = a1;
  v7 = *(_DWORD *)(a3 + 296);
  v8 = v7 + 4713;
  *(_BYTE *)(v7 + 4708) = a4;
  *(_BYTE *)(v7 + 4709) = 3;
  *(_BYTE *)(v7 + 4710) = 0;
  memcpy((void *)(v7 + 4713), a2, a1);
  memcpy((void *)(v7 + 4713 + v6), Src, Size);
  v9 = Size + v6;
  if ( a4 == 22 )
  {
    CryptMD5Update((void *)(v7 + 416), (void *)(v7 + 4713), v9);
    CryptSha1Update(v7 + 508, (void *)(v7 + 4713), v9);
  }
  v10 = *(_DWORD *)(a3 + 288);
  if ( v10 >= 24 && v10 <= 30 )
  {
    v11 = *(_DWORD *)(v7 + 36);
    if ( v11 )
    {
      v12 = *(_BYTE *)(v7 + 7);
      v23 = *(_BYTE *)(v7 + 6);
      v13 = *(_BYTE *)(v7 + 4);
      v22 = v12;
      v14 = *(_BYTE *)(v7 + 5);
      v25 = v13;
      v24 = v14;
      v15 = *(_BYTE *)(v7 + 4708);
      v18 = 0;
      v19 = 0;
      v20 = 0;
      v21 = 0;
      v26 = v15;
      v27 = BYTE1(v9);
      v28 = v9;
      if ( *(_BYTE *)(v11 + 5) == 16 )
      {
        CryptMD5Init(&Dst);
        CryptMD5Update(&Dst, *(void **)(v7 + 396), 0x10u);
        CryptMD5Update(
          &Dst,
          "666666666666666666666666666666666666666666666666\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
          "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
          0x30u);
        CryptMD5Update(&Dst, &v18, 0xBu);
        CryptMD5Update(&Dst, (void *)(v7 + 4713), v9);
        CryptMD5Final(&Dst, &v29, 16);
        CryptMD5Init(&Dst);
        CryptMD5Update(&Dst, *(void **)(v7 + 396), 0x10u);
        CryptMD5Update(
          &Dst,
          "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
          0x30u);
        CryptMD5Update(&Dst, &v29, 0x10u);
        CryptMD5Final(&Dst, v9 + v8, 16);
        v9 += 16;
      }
      if ( *(_BYTE *)(*(_DWORD *)(v7 + 36) + 5) == 20 )
      {
        CryptSha1Init(&Dst);
        CryptSha1Update((int)&Dst, *(void **)(v7 + 396), 20);
        CryptSha1Update(
          (int)&Dst,
          "666666666666666666666666666666666666666666666666\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
          "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
          40);
        CryptSha1Update((int)&Dst, &v18, 11);
        CryptSha1Update((int)&Dst, (void *)(v7 + 4713), v9);
        CryptSha1Final(&Dst, &v29, 20);
        CryptSha1Init(&Dst);
        CryptSha1Update((int)&Dst, *(void **)(v7 + 396), 20);
        CryptSha1Update(
          (int)&Dst,
          "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
          40);
        CryptSha1Update((int)&Dst, &v29, 20);
        CryptSha1Final(&Dst, v9 + v8, 20);
        v9 += 20;
      }
      if ( *(_BYTE *)(*(_DWORD *)(v7 + 36) + 4) == 1 )
        sub_B0F360(v7 + 858, v7 + 4713, v9);
      if ( *(_BYTE *)(*(_DWORD *)(v7 + 36) + 4) == 2 )
      {
        v16 = 16 - v9 % 16;
        if ( v9 % 16 == 16 )
          v16 = 16;
        memset((void *)(v9 + v8), v16 - 1, v16);
        v9 += v16;
        sub_B1C7F0(v7 + 1616, v7 + 4713, v9);
      }
    }
  }
  ++*(_DWORD *)(v7 + 4);
  *(_BYTE *)(v7 + 4712) = v9;
  *(_DWORD *)(v7 + 12) = v9 + 5;
  *(_BYTE *)(v7 + 4711) = BYTE1(v9);
  *(_DWORD *)(v7 + 8) = 0;
  return 0;
}