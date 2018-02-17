signed int __cdecl ProtoSSLControl(ProtoSSLRefT *pState, int iSelect, int iValue)
{
  signed int result; // eax

  switch ( iSelect )
  {
    case 'ciph':
      *(_DWORD *)&pState[2].strHost[140] = iValue;
      result = 0;
      break;
    case 'ncrt':
      pState[2].strHost[152] = iValue;
      result = 0;
      break;
    case 'rbuf':
      *(_DWORD *)&pState[2].strHost[144] = iValue;
      result = 0;
      break;
    case 'secu':
      if ( pState->iState == 31 )
      {
        sub_B169C0(pState, 1);
        pState->iState = 20;
        result = 0;
      }
      else
      {
        result = -1;
      }
      break;
    case 'xdns':
      pState[2].strHost[153] = iValue;
      result = 0;
      break;
    default:
      result = -1;
      break;
  }
  return result;
}