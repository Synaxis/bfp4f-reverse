const char *__stdcall Blaze::ErrorHelp::getErrorName(char *a1)
{
  if ( (signed int)a1 <= 10223625 )
  {
    if ( a1 == (_BYTE *)&loc_9C0008 + 1 )
      return "UTIL_TICKER_KEY_TOO_LONG";
    if ( (signed int)a1 > 9895945 )
    {
      if ( a1 == (char *)&unk_980009 )
        return "UTIL_TELEMETRY_KEY_TOO_LONG";
      if ( a1 == (_BYTE *)&loc_990007 + 2 )
        return "UTIL_TELEMETRY_INVALID_MAC_ADDRESS";
      if ( a1 == (char *)&loc_9B0009 )
        return "UTIL_TICKER_NO_SERVERS_AVAILABLE";
    }
    else
    {
      if ( a1 == (_BYTE *)&loc_970008 + 1 )
        return "UTIL_TELEMETRY_OUT_OF_MEMORY";
      if ( a1 == (_BYTE *)&loc_640007 + 2 )
        return "UTIL_CONFIG_NOT_FOUND";
      if ( a1 == (char *)&loc_910009 )
        return "UTIL_PSS_NO_SERVERS_AVAILABLE";
      if ( a1 == (char *)nullsub_59 )
        return "UTIL_TELEMETRY_NO_SERVERS_AVAILABLE";
    }
    return byte_F39361;
  }
  if ( (signed int)a1 <= (signed int)off_FA0008 + 1 )
  {
    if ( a1 == (char *)off_FA0008 + 1 )
      return "UTIL_USS_USER_NO_EXTENDED_DATA";
    if ( a1 == (_BYTE *)&loc_C80003 + 6 )
      return "UTIL_USS_RECORD_NOT_FOUND";
    if ( a1 == (char *)&loc_C90004 + 5 )
      return "UTIL_USS_TOO_MANY_KEYS";
    if ( a1 == (char *)&loc_CA0007 + 2 )
      return "UTIL_USS_DB_ERROR";
    return byte_F39361;
  }
  if ( a1 == aFeDice )
    return "UTIL_SUSPEND_PING_TIME_TOO_LARGE";
  if ( a1 == (char *)&off_12D0008 + 1 )
    return "UTIL_SUSPEND_PING_TIME_TOO_SMALL";
  if ( a1 != (char *)&unk_12E0009 )
    return byte_F39361;
  return "UTIL_PING_SUSPENDED";
}