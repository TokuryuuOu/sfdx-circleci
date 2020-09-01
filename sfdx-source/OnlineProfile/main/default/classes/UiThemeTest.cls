/**
 * UiTheme
 * Test
 */
@IsTest
private with sharing class UiThemeTest {
    @IsTest
    private static void test() {
        switch on (UserInfo.getUiThemeDisplayed()) {
            when 'Theme1', 'Theme2', 'Theme3' {
                System.assert(UiTheme.isClassic());
                System.assert(!UiTheme.isLightning());
            }
            when else {
                System.assert(!UiTheme.isClassic());
                System.assert(UiTheme.isLightning());
            }
        }
    }
}