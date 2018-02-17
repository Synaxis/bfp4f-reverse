void *__cdecl CryptRSAInitMaster(void *Dst, int a2, size_t Size)
{
  int v3; // eax
  int i; // esi
  char *v5; // esi
  char v6; // cl
  size_t v7; // eax

  v3 = sub_B06E30();
  for ( i = 0; i < *(_DWORD *)Dst; ++i )
    *((_BYTE *)Dst + i + 8) = ((1 << (i & 0x1F)) & v3) != 0;
  if ( *(_DWORD *)Dst > 0 )
  {
    v5 = (char *)Dst + 8;
    do
    {
      v6 = *v5;
      do
      {
        v3 = 69069 * (v3 + 1);
        v6 ^= v3;
      }
      while ( !v6 );
      *v5++ = v6;
    }
    while ( (signed int)&v5[-8 - (_DWORD)Dst] < *(_DWORD *)Dst );
  }
  v7 = *(_DWORD *)Dst - Size;
  *((_BYTE *)Dst + 8) = 0;
  *((_BYTE *)Dst + 9) = 2;
  *((_BYTE *)Dst + v7 + 7) = 0;
  return memcpy((char *)Dst + v7 + 8, (const void *)a2, Size);
}