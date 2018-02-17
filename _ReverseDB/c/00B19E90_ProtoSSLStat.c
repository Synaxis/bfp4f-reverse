int __cdecl ProtoSSLStat(ProtoSSLRefT *pState, int iSelect, void *Dst, size_t Size)
{
  int result; // eax
  int v5; // eax
  signed int v6; // eax

  result = -1;
  switch ( iSelect )
  {
    case 'addr':
      return (unsigned __int8)pState->PeerAddr.sa_data[5] | (((unsigned __int8)pState->PeerAddr.sa_data[4] | (((unsigned __int8)pState->PeerAddr.sa_data[3] | ((unsigned __int8)pState->PeerAddr.sa_data[2] << 8)) << 8)) << 8);
    case 'cert':
      if ( Dst && Size == 448 )
      {
        qmemcpy(Dst, &pState[1].pHost, 0x1C0u);
        return 0;
      }
      goto LABEL_27;
    case 'serr':
      if ( pState->pSock )
        result = SocketInfo((int)pState->pSock, 'serr', 0, Dst, Size);
      else
        result = *(_DWORD *)&pState[2].strHost[148];
      break;
    case 'sock':
      if ( Dst && Size == 4 )
      {
        *(_DWORD *)Dst = pState->pSock;
        return 0;
      }
      return -1;
    case 'fail':
      v5 = pState->iState;
      if ( !(v5 & 0x1000) )
        return 0;
      switch ( v5 )
      {
        case 4097:
          return -1;
        case 4098:
          result = -2;
          break;
        case 4099:
          result = -3;
          break;
        case 4100:
          result = -4;
          break;
        case 4101:
          result = -5;
          break;
        case 4102:
          result = -6;
          break;
        case 4103:
          result = -7;
          break;
        default:
          result = -8;
          break;
      }
      break;
    default:
LABEL_27:
      if ( !pState->pSock )
        return result;
      if ( iSelect != 'stat' )
        return SocketInfo((int)pState->pSock, iSelect, 0, Dst, Size);
      v6 = pState->iState;
      if ( v6 < 4096 )
      {
        if ( v6 >= 30 )
          return SocketInfo((int)pState->pSock, iSelect, 0, Dst, Size);
        return 0;
      }
      return -1;
  }
  return result;
}