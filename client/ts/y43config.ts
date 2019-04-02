enum y43configModeEnum
{
    debug="debug",
    demo="demo",
    release="release",
}

class _y43config
{
    public mode:y43configModeEnum = y43configModeEnum.debug;
}
let y43config = new _y43config();