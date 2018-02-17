char *__cdecl CryptMD5Update(void *Dst, void *Src, size_t Size)
{
  char *v3; // ebp
  signed int v4; // esi
  bool v5; // zf
  char *result; // eax
  signed int v7; // edi
  char *v8; // eax
  unsigned int v9; // edi

  v3 = (char *)Src;
  v4 = Size;
  if ( (Size & 0x80000000) != 0 )
  {
    v4 = 0;
    if ( *(_BYTE *)Src )
    {
      do
        ++v4;
      while ( *((_BYTE *)Src + v4) );
    }
  }
  result = (char *)(*((_DWORD *)Dst + 18) & 0x3F);
  v5 = result == 0;
  *((_DWORD *)Dst + 18) += v4;
  if ( !v5 )
  {
    v7 = 64 - (_DWORD)result;
    v8 = &result[(_DWORD)Dst];
    if ( v4 < v7 )
      return (char *)memcpy(v8, Src, v4);
    memcpy(v8, Src, v7);
    v3 = (char *)Src + v7;
    v4 -= v7;
    result = (char *)sub_B1B2C0(Dst);
  }
  if ( v4 >= 64 )
  {
    v9 = (unsigned int)v4 >> 6;
    v4 += -64 * ((unsigned int)v4 >> 6);
    do
    {
      result = (char *)sub_B1B2C0(v3);
      v3 += 64;
      --v9;
    }
    while ( v9 );
  }
  if ( v4 > 0 )
    result = (char *)memcpy(Dst, v3, v4);
  return result;
}