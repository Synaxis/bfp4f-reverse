void *__cdecl CryptRSAInitSignature(void *Dst, const void *a2, size_t a3)
{
  return memcpy((char *)Dst + 8, a2, a3);
}