/**
 * CSVレコード
 */
public with sharing class CsvRecord {
    private String recordString = '';

    public void addValue(String value) {
        if (String.isNotBlank(value)) {
            recordString += '"' + value.replace('"', '""') + '",';
        } else {
            recordString += '"",';
        }
    }

    public override String toString() {
        return recordString.removeEnd(',') + '\r\n';
    }
}