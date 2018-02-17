unsigned int __cdecl CryptMD5Final(int a1, _BYTE *a2, signed int a3)
{
  int v3; // eax
  _BYTE *v4; // esi
  int v5; // eax
  unsigned int v6; // eax
  _DWORD *v7; // ecx
  unsigned int v8; // eax
  char *v9; // edi
  signed int v10; // ecx
  unsigned int v11; // eax
  unsigned int result; // eax
  unsigned int v13; // [esp+10h] [ebp-4h]

  v3 = *(_DWORD *)(a1 + 72) & 0x3F;
  *(_BYTE *)(v3 + a1) = -128;
  v4 = a2;
  v5 = v3 + 1;
  v13 = 0;
  if ( v5 > 56 )
  {
    *(_BYTE *)(v5 + a1) = 0;
    *(_BYTE *)(v5 + a1 + 1) = 0;
    *(_BYTE *)(v5 + a1 + 2) = 0;
    *(_BYTE *)(v5 + a1 + 3) = 0;
    *(_BYTE *)(v5 + a1 + 4) = 0;
    *(_BYTE *)(v5 + a1 + 5) = 0;
    *(_BYTE *)(v5 + a1 + 6) = 0;
    *(_BYTE *)(v5 + a1 + 7) = 0;
    sub_B1B2C0(a1);
    v5 = 0;
  }
  *(_BYTE *)(v5 + a1) = 0;
  *(_BYTE *)(v5 + a1 + 1) = 0;
  *(_BYTE *)(v5 + a1 + 2) = 0;
  v6 = (v5 + 3) >> 2;
  v7 = (_DWORD *)(a1 + 4 * v6);
  do
  {
    *v7 = 0;
    ++v6;
    ++v7;
  }
  while ( v6 < 0x10 );
  *(_BYTE *)(a1 + 56) = 8 * *(_BYTE *)(a1 + 72);
  v8 = *(_DWORD *)(a1 + 72);
  *(_BYTE *)(a1 + 57) = *(_DWORD *)(a1 + 72) >> 5;
  *(_BYTE *)(a1 + 59) = v8 >> 21;
  *(_BYTE *)(a1 + 58) = v8 >> 13;
  *(_BYTE *)(a1 + 60) = v8 >> 29;
  sub_B1B2C0(a1);
  v9 = off_12C261C;
  v10 = 0;
  do
  {
    if ( v10 & 3 )
      v11 = v13;
    else
      v11 = *(_DWORD *)(a1 + 4 * (v10 >> 2) + 76);
    if ( a3 < 33 )
    {
      if ( v10 >= a3 )
        goto LABEL_14;
      *v4 = v11;
    }
    else
    {
      *v4++ = v9[(unsigned __int8)v11 >> 4];
      *v4 = v9[v11 & 0xF];
    }
    ++v4;
LABEL_14:
    result = v11 >> 8;
    ++v10;
    v13 = result;
  }
  while ( v10 < 16 );
  if ( a3 >= 33 )
    *v4 = 0;
  return result;
}