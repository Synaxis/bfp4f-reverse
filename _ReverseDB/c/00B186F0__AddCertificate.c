signed int __cdecl AddCertificate(_DWORD *a1, char a2, int a3)
{
  size_t v3; // edi
  _DWORD *v5; // eax
  _DWORD *v6; // esi
  char *v7; // eax
  char *v8; // ebx
  void *v9; // eax
  size_t v10; // ST14_4
  size_t v11; // ST08_4

  v3 = a1[508] + 492;
  if ( sub_B17500(a1) )
    return 0;
  v5 = off_12C1FF8;
  v6 = &unk_12C1E10;
  if ( off_12C1FF8 )
  {
    do
    {
      v6 = v5;
      v5 = (_DWORD *)v5[122];
    }
    while ( v5 );
  }
  v7 = (char *)DirtyMemAlloc(v3);
  v8 = v7;
  v6[122] = v7;
  if ( !v7 )
    return 0;
  memset(v7, 0, v3);
  if ( !a2 )
  {
    v9 = (void *)DirtyMemAlloc(2592);
    *((_DWORD *)v8 + 121) = v9;
    if ( !v9 )
    {
      DirtyMemFree(*((dice::hfe::memory **)v8 + 122));
      *((_DWORD *)v8 + 122) = 0;
      return 0;
    }
    qmemcpy(v9, a1, 0xA20u);
  }
  qmemcpy(v8, a1 + 112, 0x1C0u);
  v10 = a1[637];
  *((_DWORD *)v8 + 114) = v10;
  memcpy(v8 + 460, a1 + 638, v10);
  v11 = a1[508];
  *((_DWORD *)v8 + 112) = a1[508];
  *((_DWORD *)v8 + 113) = v8 + 492;
  memcpy(v8 + 492, a1 + 509, v11);
  *((_DWORD *)v8 + 119) = a3;
  return 1;
}