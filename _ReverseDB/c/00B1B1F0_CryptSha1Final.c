int __cdecl CryptSha1Final(int *a1)
{
  int v1; // eax
  char v2; // cl
  unsigned int v3; // eax
  unsigned int v4; // eax
  unsigned int v5; // eax
  unsigned int v6; // ecx
  char v7; // dl

  v1 = a1[1];
  *a1 += v1;
  v2 = -128;
  if ( (unsigned int)(64 - v1) < 9 )
  {
    *((_BYTE *)a1 + v1 + 28) = -128;
    v3 = a1[1] + 1;
    if ( v3 < 0x40 )
      memset((char *)a1 + v3 + 28, 0, 64 - v3);
    sub_B1AF40(a1);
    v2 = 0;
    a1[1] = 0;
  }
  *((_BYTE *)a1 + a1[1] + 28) = v2;
  v4 = a1[1] + 1;
  if ( v4 < 0x38 )
    memset((char *)a1 + v4 + 28, 0, 56 - v4);
  v5 = *a1;
  v6 = *a1;
  *((_BYTE *)a1 + 88) = (unsigned int)*a1 >> 21;
  v7 = *(_BYTE *)a1;
  *((_BYTE *)a1 + 87) = v6 >> 29;
  *((_BYTE *)a1 + 90) = v5 >> 5;
  *((_BYTE *)a1 + 84) = 0;
  *((_BYTE *)a1 + 85) = 0;
  *((_BYTE *)a1 + 86) = 0;
  *((_BYTE *)a1 + 89) = v5 >> 13;
  *((_BYTE *)a1 + 91) = 8 * v7;
  sub_B1AF40(a1);
  return sub_B1AEF0(a1);
}