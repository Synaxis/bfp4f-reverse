int __cdecl CryptRSAEncrypt(_DWORD *a1)
{
  int v1; // esi

  v1 = a1[1];
  return sub_B1CE30(a1 + 2, a1 + 2, *a1, (char *)a1 + 1545);
}