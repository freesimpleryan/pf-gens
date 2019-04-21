import re
import PyPDF2
import json

def main():
    # Honestly don't try to get this to work - this is super rigged up
    json_data = {}
    pdf_path = ""
    page = 224
    pdfFileObject = open(pdf_path, 'rb')
    pdfReader = PyPDF2.PdfFileReader(pdfFileObject)
    p = pdfReader.getPage(page)
    page_text = p.extractText()
    with open("outtext.txt", "w+", encoding='utf-8') as txtfile:
        txtfile.write(page_text)
    exit(0)
    ranged_value_regex = "\d{1,2}\s*Œ\s*\d{1,3}"
    raw_values = re.findall(ranged_value_regex, page_text)
    data = {
        "data": {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": []
        }
    }
    for index, r in enumerate(raw_values):
        split_start = page_text.split(r)
        # Get everything after break
        start_capture = split_start[1]
        if r == "99Œ100":
            end_capture = start_capture
        else:
            # Get everything before break
            split_end = start_capture.split(raw_values[index+1])
            end_capture = split_end[0]
        linebroken = end_capture.splitlines()
        del linebroken[0]
        if len(linebroken) > 5:
            del linebroken[0]
        for index, word in enumerate(linebroken):
            d = data["data"]
            d[str(index + 1)].append(word.strip())
    with open("../data/npcgroupnames.json", "w+") as outfile:
        outfile.write(json.dumps(data))

if __name__ == "__main__":
    main()
    