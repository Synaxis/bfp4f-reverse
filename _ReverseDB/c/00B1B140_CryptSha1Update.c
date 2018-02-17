char *__cdecl CryptSha1Update(int a1, void *Src, int a3)
{
  unsigned int v3; // ebx
  _DWORD *v4; // esi
  char *result; // eax
  int v6; // ebp
  char *v7; // edi
  unsigned int v8; // ebp
  int v9; // [esp+14h] [ebp+4h]

  v3 = a3;
  v4 = (_DWORD *)a1;
  result = *(char **)(a1 + 4);
  if ( result )
  {
    v6 = 64 - (_DWORD)result;
    v9 = 64 - (_DWORD)result;
    if ( 64 - (signed int)result > (unsigned int)a3 )
      v6 = a3;
    result = (char *)memcpy((char *)v4 + (_DWORD)result + 28, Src, v6);
    v7 = (char *)Src + v6;
    v3 = a3 - v6;
    if ( v6 == v9 )
    {
      result = (char *)sub_B1AF40(v4);
      *v4 += 64;
      v4[1] = 0;
    }
    else
    {
      v4[1] += v6;
    }
  }
  else
  {
    v7 = (char *)Src;
  }
  if ( v3 >= 0x40 )
  {
    v8 = v3 >> 6;
    do
    {
      result = (char *)sub_B1AF40(v4);
      *v4 += 64;
      v3 -= 64;
      v7 += 64;
      --v8;
    }
    while ( v8 );
  }
  if ( v3 )
  {
    result = (char *)memcpy((char *)v4 + v4[1] + 28, v7, v3);
    v4[1] += v3;
  }
  return result;
}