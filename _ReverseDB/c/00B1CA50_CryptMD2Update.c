void *__cdecl CryptMD2Update(int a1, void *Src, int a3)
{
  char *v3; // ecx
  int v4; // esi
  int v5; // eax
  signed int v6; // ebx
  signed int v7; // ebp
  int i; // ebx

  v3 = (char *)Src;
  v4 = a3;
  if ( a3 < 0 )
  {
    v4 = 0;
    if ( *(_BYTE *)Src )
    {
      do
        ++v4;
      while ( *((_BYTE *)Src + v4) );
    }
  }
  v5 = *(_DWORD *)a1;
  v6 = 16 - *(_DWORD *)a1;
  *(_DWORD *)a1 = ((unsigned __int8)*(_DWORD *)a1 + (_BYTE)v4) & 0xF;
  if ( v4 < v6 )
  {
    v7 = 0;
  }
  else
  {
    memcpy((void *)(v5 + a1 + 36), Src, v6);
    sub_B1C830(a1 + 36);
    v7 = v6;
    for ( i = v6 + 15; i < v4; v7 += 16 )
    {
      sub_B1C830((char *)Src + i - 15);
      i += 16;
    }
    v3 = (char *)Src;
    v5 = 0;
  }
  return memcpy((void *)(v5 + a1 + 36), &v3[v7], v4 - v7);
}