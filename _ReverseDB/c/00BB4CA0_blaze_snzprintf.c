int blaze_snzprintf(char *DstBuf, size_t MaxCount, char *Format, ...)
{
  int result; // eax
  va_list va; // [esp+14h] [ebp+10h]

  va_start(va, Format);
  if ( !MaxCount )
    return 0;
  result = vsnprintf(DstBuf, MaxCount, Format, va);
  if ( result >= (signed int)MaxCount || result < 0 )
    result = 0;
  DstBuf[result] = 0;
  return result;
}