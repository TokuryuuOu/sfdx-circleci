/**
 * UiTheme
 */
public with sharing class UiTheme {
    private static Boolean isClassic;

    private UiTheme() {}

    public static Boolean isClassic() {
        if (isClassic == null) {
            switch on (UserInfo.getUiThemeDisplayed()) {
                when 'Theme1', 'Theme2', 'Theme3' {
                    isClassic = true;
                }
                when else {
                    isClassic = false;
                }
            }

        }
        return isClassic;
    }

    public static Boolean isLightning() {
        return !isClassic();
    }
}