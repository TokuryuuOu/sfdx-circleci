/**
 * VCard
 */
public with sharing class VCard {
    public static final String NEWLINE = '\n';
    private static final String VCARD_BEGIN = 'BEGIN:VCARD' + NEWLINE;
    private static final String VERSION = 'VERSION:3.0' + NEWLINE;
    private static final String VCARD_END = 'END:VCARD' + NEWLINE;
    private String n;
    private String fn;
    private String org;
    private String email;
    private String tel;
    private String cell;
    private String adr;
    private String url;

    public void setN(String lastName, String firstName) {
        lastName = getValue(lastName);
        firstName = getValue(firstName);

        if (String.isNotBlank(lastName) || String.isNotBlank(firstName)) {
            //他社製品の電話帳登録機能を手本に漢字が含まれ得る項目のみCHARSETを明示的に指定してあります
            n = getRecord('N;CHARSET=utf-8:', lastName + ';' + firstName);
            fn = getRecord('FN;CHARSET=utf-8:', firstName + ' ' + lastName);
        } else {
            n = null;
            fn = null;
        }
    }

    public void setOrg(String value) {
        org = getRecord('ORG;CHARSET=utf-8:', value);
    }

    public void setEmail(String value) {
        email = getRecord('EMAIL;type=INTERNET;type=WORK;type=pref:', value);
    }

    public void setTel(String value) {
        tel = getRecord('TEL;type=OTHER;type=VOICE;type=pref:', value);
    }

    public void setTel1(String value) {
        tel = getRecord('TEL;type=WORK;type=VOICE;type=pref:', value);
    }

    public void setCell(String value) {
        cell = getRecord('TEL;type=CELL;type=VOICE:', value);
    }

    public void setAdr(String country, String postalCode, String state, String city, String street) {
        if (String.isNotBlank(postalCode) && String.isNotBlank(state) && String.isNotBlank(city) && String.isNotBlank(street)) {
            adr = getRecord('item1.ADR;type=WORK;type=pref;CHARSET=utf-8:;;',
                getValue(street) + ';' + getValue(city) + ';' + getValue(state) + ';' + getValue(postalCode) + ';' + getValue(country));
        } else {
            adr = null;
        }
    }

    public void setUrl(String value) {
        url = getRecord('URL;type=WORK;type=pref:',  value);
    }

    private String getRecord(String prefix, String value) {
        if (String.isNotBlank(value)) {
            return prefix + getValue(value) + NEWLINE;
        } else {
            return null;
        }
    }

    private String getValue(String value) {
        return String.isNotBlank(value) ? value.replace('\r', '').replace('\n', '') : '';
    }

    public override String toString() {
        String body = VCARD_BEGIN + VERSION;
        if (String.isNotBlank(n)) body += n;
        if (String.isNotBlank(fn)) body += fn;
        if (String.isNotBlank(org)) body += org;
        if (String.isNotBlank(email)) body += email;
        if (String.isNotBlank(tel)) body += tel;
        if (String.isNotBlank(cell)) body += cell;
        if (String.isNotBlank(adr)) body += adr;
        if (String.isNotBlank(url)) body += url;
        body += VCARD_END;
        return body;
    }
}