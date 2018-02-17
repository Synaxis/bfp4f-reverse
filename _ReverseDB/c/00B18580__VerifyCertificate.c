signed int __cdecl VerifyCertificate(int a1, size_t *a2, char a3)
{
  size_t *v3; // esi
  signed int result; // eax
  char *v5; // ebp
  size_t v6; // edx
  size_t *v7; // eax
  int v8; // ST0C_4
  int v9; // ST08_4
  signed int v10; // [esp+10h] [ebp-4h]

  v3 = a2;
  v10 = 0;
  if ( a3 != 1 || sub_B17380((const char *)a2 + 448, (const char *)a2, 1) )
  {
    v5 = (char *)&unk_12C1E10;
    do
    {
      if ( !sub_B17380(v5, (const char *)v3, a3) )
      {
        v6 = *((_DWORD *)v5 + 112);
        if ( v6 == v3[378] && !VerifyCertificateSub(v5 + 460, v6, *((_DWORD *)v5 + 114), (int)v3, *((void **)v5 + 113)) )
        {
          v7 = (size_t *)*((_DWORD *)v5 + 121);
          if ( !v7 )
            goto LABEL_20;
          v10 = VerifyCertificate(a1, v7, 1);
          if ( !v10 )
          {
            v8 = *((_DWORD *)v5 + 120);
            v9 = *((_DWORD *)v5 + 119);
            DirtyMemFree(*((dice::hfe::memory **)v5 + 121));
            *((_DWORD *)v5 + 121) = 0;
            goto LABEL_20;
          }
          if ( a1 && !*(_BYTE *)(a1 + 762) )
          {
            qmemcpy((void *)(a1 + 300), *((const void **)v5 + 121), 0x1C0u);
            v3 = a2;
            *(_BYTE *)(a1 + 762) = 1;
          }
        }
      }
      v5 = (char *)*((_DWORD *)v5 + 122);
    }
    while ( v5 );
    if ( a1 )
    {
      if ( !*(_BYTE *)(a1 + 762) )
      {
        qmemcpy((void *)(a1 + 300), v3, 0x1C0u);
        *(_BYTE *)(a1 + 762) = 1;
      }
    }
    result = -28;
  }
  else if ( VerifyCertificateSub(a2 + 638, a2[508], a2[637], (int)a2, a2 + 509) )
  {
    result = -30;
  }
  else
  {
LABEL_20:
    result = v10;
  }
  return result;
}