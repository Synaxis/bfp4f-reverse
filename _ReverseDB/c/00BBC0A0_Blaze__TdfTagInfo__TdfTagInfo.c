_DWORD *__thiscall Blaze::TdfTagInfo::TdfTagInfo(_DWORD *this, unsigned __int8 a2, int a3, int a4, __int16 a5)
{
  _DWORD *v5; // esi
  int v6; // eax

  v5 = this;
  *this = &Blaze::TdfStructVectorBase::`vftable';
  v6 = sub_B23EB0(a2);
  v5[1] = 0;
  v5[2] = 0;
  v5[3] = 0;
  v5[4] = v6;
  v5[5] = ~(a2 >> 7) & 1;
  *((_WORD *)v5 + 14) = a5;
  *((_BYTE *)v5 + 34) = a2;
  v5[6] = 0;
  *((_WORD *)v5 + 15) = 0;
  *((_WORD *)v5 + 16) = 0;
  return v5;
}