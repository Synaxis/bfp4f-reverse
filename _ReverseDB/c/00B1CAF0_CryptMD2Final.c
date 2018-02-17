void *__cdecl CryptMD2Final(void *Dst, int a2, int a3)
{
  void *result; // eax

  if ( a3 >= 16 )
  {
    CryptMD2Update((int)Dst, *(&off_12C2720 + 16 - *(_DWORD *)Dst), 16 - *(_DWORD *)Dst);
    CryptMD2Update((int)Dst, (char *)Dst + 20, 16);
    *(_DWORD *)a2 = *((_DWORD *)Dst + 1);
    *(_DWORD *)(a2 + 4) = *((_DWORD *)Dst + 2);
    *(_DWORD *)(a2 + 8) = *((_DWORD *)Dst + 3);
    *(_DWORD *)(a2 + 12) = *((_DWORD *)Dst + 4);
    result = memset(Dst, 0, 0x34u);
  }
  return result;
}