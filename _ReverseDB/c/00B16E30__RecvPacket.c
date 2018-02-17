signed int __usercall RecvPacket@<eax>(int a1@<edi>)
{
  int v1; // esi
  int v2; // ecx
  unsigned __int8 v4; // al
  signed int v5; // eax
  int v6; // eax
  int v7; // ebx
  int v8; // edx
  int v9; // ecx
  int v10; // ebx
  int v11; // eax
  char v12; // dl
  char v13; // dl
  int v14; // eax
  unsigned int v15; // edx
  char *v16; // ecx
  int v17; // eax
  unsigned int v18; // edx
  char *v19; // ecx
  char Src; // [esp+4h] [ebp-7Ch]
  char v21; // [esp+5h] [ebp-7Bh]
  char v22; // [esp+6h] [ebp-7Ah]
  char v23; // [esp+7h] [ebp-79h]
  char v24; // [esp+8h] [ebp-78h]
  char v25; // [esp+9h] [ebp-77h]
  char v26; // [esp+Ah] [ebp-76h]
  char v27; // [esp+Bh] [ebp-75h]
  char v28; // [esp+Ch] [ebp-74h]
  char v29; // [esp+Dh] [ebp-73h]
  char v30; // [esp+Eh] [ebp-72h]
  char v31[20]; // [esp+10h] [ebp-70h]
  int Dst; // [esp+24h] [ebp-5Ch]

  v1 = *(_DWORD *)(a1 + 296);
  v2 = *(_DWORD *)(v1 + 24);
  *(_DWORD *)(v1 + 28) = v2;
  if ( *(_DWORD *)(v1 + 20) != v2 )
    return -1;
  v4 = *(_BYTE *)(v1 + 21092);
  if ( v4 < 0x14u || v4 > 0x17u )
    return -2;
  if ( *(_BYTE *)(v1 + 21093) != 3 || *(_BYTE *)(v1 + 21094) )
    return -3;
  if ( v2 != (*(unsigned __int8 *)(v1 + 21096) | (*(unsigned __int8 *)(v1 + 21095) << 8)) + 5 )
    return -4;
  *(_DWORD *)(v1 + 28) = 5;
  v5 = *(_DWORD *)(a1 + 288);
  if ( v5 < 26 )
    goto LABEL_27;
  if ( v5 > 30 )
    goto LABEL_27;
  v6 = *(_DWORD *)(v1 + 36);
  if ( !v6 )
    goto LABEL_27;
  v7 = v2 - 5;
  if ( *(_BYTE *)(v6 + 4) == 1 )
    sub_B0F360(v1 + 600, v1 + 21097, v2 - 5);
  if ( *(_BYTE *)(*(_DWORD *)(v1 + 36) + 4) == 2 )
  {
    sub_B1C810(v1 + 1116, v1 + *(_DWORD *)(v1 + 28) + 21092, v7);
    v8 = *(_DWORD *)(v1 + 28);
    if ( *(unsigned __int8 *)(v7 + v1 + v8 + 21091) <= 0xFu )
      v7 -= *(unsigned __int8 *)(v7 + v1 + v8 + 21091) + 1;
  }
  v9 = *(_DWORD *)(v1 + 36);
  if ( v7 < *(unsigned __int8 *)(v9 + 5) )
    return -4;
  v10 = v7 - *(unsigned __int8 *)(v9 + 5);
  v11 = v10 + *(_DWORD *)(v1 + 28);
  v12 = *(_BYTE *)(v1 + 18);
  *(_DWORD *)(v1 + 24) = v11;
  *(_DWORD *)(v1 + 20) = v11;
  LOBYTE(v11) = *(_BYTE *)(v1 + 19);
  v25 = v12;
  v13 = *(_BYTE *)(v1 + 16);
  v24 = v11;
  LOBYTE(v11) = *(_BYTE *)(v1 + 17);
  v27 = v13;
  v26 = v11;
  LOBYTE(v11) = *(_BYTE *)(v1 + 21092);
  Src = 0;
  v21 = 0;
  v22 = 0;
  v23 = 0;
  v28 = v11;
  v29 = BYTE1(v10);
  v30 = v10;
  if ( *(_BYTE *)(v9 + 5) != 16 )
  {
LABEL_23:
    if ( *(_BYTE *)(*(_DWORD *)(v1 + 36) + 5) == 20 )
    {
      CryptSha1Init(&Dst);
      CryptSha1Update((int)&Dst, *(void **)(v1 + 392), 20);
      CryptSha1Update(
        (int)&Dst,
        "666666666666666666666666666666666666666666666666\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
        "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
        40);
      CryptSha1Update((int)&Dst, &Src, 11);
      CryptSha1Update(
        (int)&Dst,
        (void *)(*(_DWORD *)(v1 + 28) + v1 + 21092),
        *(_DWORD *)(v1 + 24) - *(_DWORD *)(v1 + 28));
      CryptSha1Final(&Dst, v31, 20);
      CryptSha1Init(&Dst);
      CryptSha1Update((int)&Dst, *(void **)(v1 + 392), 20);
      CryptSha1Update(
        (int)&Dst,
        "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
        40);
      CryptSha1Update((int)&Dst, v31, 20);
      CryptSha1Final(&Dst, v31, 20);
      v17 = *(_DWORD *)(v1 + 24) + v1 + 21092;
      v18 = 20;
      v19 = &v31[-v17];
      while ( *(_DWORD *)&v19[v17] == *(_DWORD *)v17 )
      {
        v18 -= 4;
        v17 += 4;
        if ( v18 < 4 )
          goto LABEL_27;
      }
      return -6;
    }
LABEL_27:
    if ( *(_BYTE *)(v1 + 21092) == 22 && *(_DWORD *)(a1 + 288) < 26 )
    {
      CryptMD5Update(
        (void *)(v1 + 416),
        (void *)(*(_DWORD *)(v1 + 28) + v1 + 21092),
        *(_DWORD *)(v1 + 24) - *(_DWORD *)(v1 + 28));
      CryptSha1Update(
        v1 + 508,
        (void *)(*(_DWORD *)(v1 + 28) + v1 + 21092),
        *(_DWORD *)(v1 + 24) - *(_DWORD *)(v1 + 28));
    }
    ++*(_DWORD *)(v1 + 16);
    *(_DWORD *)(v1 + 32) = 1;
    return 0;
  }
  CryptMD5Init(&Dst);
  CryptMD5Update(&Dst, *(void **)(v1 + 392), 0x10u);
  CryptMD5Update(
    &Dst,
    "666666666666666666666666666666666666666666666666\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    0x30u);
  CryptMD5Update(&Dst, &Src, 0xBu);
  CryptMD5Update(&Dst, (void *)(*(_DWORD *)(v1 + 28) + v1 + 21092), *(_DWORD *)(v1 + 24) - *(_DWORD *)(v1 + 28));
  CryptMD5Final(&Dst, v31, 16);
  CryptMD5Init(&Dst);
  CryptMD5Update(&Dst, *(void **)(v1 + 392), 0x10u);
  CryptMD5Update(
    &Dst,
    "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",
    0x30u);
  CryptMD5Update(&Dst, v31, 0x10u);
  CryptMD5Final(&Dst, v31, 16);
  v14 = *(_DWORD *)(v1 + 24) + v1 + 21092;
  v15 = 16;
  v16 = &v31[-v14];
  while ( *(_DWORD *)&v16[v14] == *(_DWORD *)v14 )
  {
    v15 -= 4;
    v14 += 4;
    if ( v15 < 4 )
      goto LABEL_23;
  }
  return -5;
}