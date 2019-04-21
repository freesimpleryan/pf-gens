import re
import PyPDF2
import json

def main():
    # Honestly don't try to get this to work - this is super rigged up
    json_data = {}
    pdf_path = ""
    data_name = "npcbgs"
    json_output_path = "../data/%s.json" % data_name
    special_dash_char = "Œ"
    MAX_VALUE = 100
    page = 94
    ranged = True
    pdfFileObject = open(pdf_path, 'rb')
    pdfReader = PyPDF2.PdfFileReader(pdfFileObject)
    p = pdfReader.getPage(page)
    page_text = p.extractText()
    if ranged:
        ranged_value_regex = "\d{1,2}Œ\d{1,3}"
        raw_values = re.findall(ranged_value_regex, page_text)
        for v in raw_values:
            roll_range = v.split(special_dash_char)
            text_start = page_text.split(v)[1]
            text_end = text_start.split(special_dash_char)[0]
            text_list = text_end.splitlines()
            if text_list[-1].isdigit():
                del text_list[-1]
            text = ''.join(text_list)
            text = text.replace('™', "'")
            for value in roll_range:
                json_data[value] = text
    else:
        for i in range(1,MAX_VALUE+1):
            value = "%s" % str(i)
            end_value = "%s" % str(i + 1)
            start_text = page_text.split(value)[1]
            captured_text = start_text.split(end_value)[0]
            t = captured_text.splitlines()
            text = ''.join(t)
            json_data[value] = text
    json_text = json.dumps(json_data)
    with open(json_output_path, "w+") as json_file:
        json_file.write(json_text)
    print("Created %s" % json_output_path)
    

if __name__ == "__main__":
    main()
    