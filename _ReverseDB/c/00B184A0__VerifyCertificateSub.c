int __usercall VerifyCertificateSub@<eax>(void *a1@<ecx>, size_t Size@<edx>, size_t a3@<eax>, int a4, void *Src)
{
  int v5; // ST0C_4
  unsigned int v6; // ecx
  unsigned __int8 *v7; // esi
  char *v8; // edx
  int v9; // eax
  int Dst; // [esp+8h] [ebp-814h]
  char v12[2060]; // [esp+10h] [ebp-80Ch]

  CryptRSAInit((int)&Dst, Src, Size, a1, a3);
  v5 = *(_DWORD *)(a4 + 1512);
  CryptRSAInitSignature(&Dst);
  CryptRSAEncrypt(&Dst);
  v6 = *(_DWORD *)(a4 + 2568);
  v7 = (unsigned __int8 *)(a4 + 2572);
  v8 = &v12[(*(_DWORD *)(a4 + 1512) & 0xFFFE) - v6];
  if ( v6 < 4 )
  {
LABEL_4:
    if ( !v6 )
      return 0;
  }
  else
  {
    while ( *(_DWORD *)v7 == *(_DWORD *)v8 )
    {
      v6 -= 4;
      v8 += 4;
      v7 += 4;
      if ( v6 < 4 )
        goto LABEL_4;
    }
  }
  v9 = *v7 - (unsigned __int8)*v8;
  if ( *v7 != (unsigned __int8)*v8 )
    return (v9 >> 31) | 1;
  if ( v6 <= 1 )
    return 0;
  v9 = v7[1] - (unsigned __int8)v8[1];
  if ( v7[1] != (unsigned __int8)v8[1] )
    return (v9 >> 31) | 1;
  if ( v6 <= 2 )
    return 0;
  v9 = v7[2] - (unsigned __int8)v8[2];
  if ( v7[2] != (unsigned __int8)v8[2] )
    return (v9 >> 31) | 1;
  if ( v6 > 3 )
  {
    v9 = v7[3] - (unsigned __int8)v8[3];
    return (v9 >> 31) | 1;
  }
  return 0;
}