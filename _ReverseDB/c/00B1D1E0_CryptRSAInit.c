void *__cdecl CryptRSAInit(int a1, void *Src, size_t Size, void *a4, size_t a5)
{
  size_t v5; // eax
  size_t v6; // edi

  v5 = Size;
  if ( (signed int)Size > 512 )
    v5 = 512;
  v6 = a5;
  if ( (signed int)a5 > 512 )
    v6 = 512;
  *(_DWORD *)a1 = v5;
  *(_DWORD *)(a1 + 4) = v6;
  memcpy((void *)(a1 + 1032), Src, v5);
  return memcpy((void *)(a1 + 1545), a4, v6);
}