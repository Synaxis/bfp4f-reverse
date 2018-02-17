const char *__stdcall Blaze::Util::getComponentName(__int16 a1)
{
  const char *result; // eax

  switch ( a1 )
  {
    case 1:
      result = "fetchClientConfig";
      break;
    case 2:
      result = "ping";
      break;
    case 3:
      result = "setClientData";
      break;
    case 4:
      result = "localizeStrings";
      break;
    case 5:
      result = "getTelemetryServer";
      break;
    case 6:
      result = "getTickerServer";
      break;
    case 7:
      result = "preAuth";
      break;
    case 8:
      result = "postAuth";
      break;
    case 0xA:
      result = "userSettingsLoad";
      break;
    case 0xB:
      result = "userSettingsSave";
      break;
    case 0xC:
      result = "userSettingsLoadAll";
      break;
    case 0xE:
      result = "deleteUserSettings";
      break;
    case 0x14:
      result = "filterForProfanity";
      break;
    case 0x15:
      result = "fetchQosConfig";
      break;
    case 0x16:
      result = "setClientMetrics";
      break;
    case 0x17:
      result = "setConnectionState";
      break;
    case 0x18:
      result = "getPssConfig";
      break;
    case 0x19:
      result = "getUserOptions";
      break;
    case 0x1A:
      result = "setUserOptions";
      break;
    case 0x1B:
      result = "suspendUserPing";
      break;
    default:
      result = byte_F39361;
      break;
  }
  return result;
}