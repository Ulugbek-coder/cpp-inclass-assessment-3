// ===============================================================
// Exam Version C
// ===============================================================

window.VERSION_C = {
  id: "C",
  shuffleSeed: "C_2026_CPPv1",
  coding: [
    {
      title_en: "Coding Problem 1 — Sum of Digits",
      title_uz: "1-Kodlash Masalasi — Raqamlar Yig'indisi",
      en: [
        "Ask the user to enter a positive integer.",
        "Use a <code>while</code> loop to compute the sum of its digits.",
        "Display the sum.",
        "Example: input 1234 → Sum of digits = 10 (because 1+2+3+4=10)"
      ],
      uz: [
        "Foydalanuvchidan musbat butun son kiritishni so'rang.",
        "Uning raqamlar yig'indisini hisoblash uchun <code>while</code> siklidan foydalaning.",
        "Yig'indini ko'rsating.",
        "Misol: kirish 1234 → Sum of digits = 10 (chunki 1+2+3+4=10)"
      ],
      hints: [
        { en: "The last digit of a number can be obtained using <code>n % 10</code>.", uz: "Sonning oxirgi raqamini <code>n % 10</code> yordamida olish mumkin." },
        { en: "Integer division by 10 (<code>n / 10</code>) removes the last digit.", uz: "10 ga butun bo'lish (<code>n / 10</code>) oxirgi raqamni olib tashlaydi." },
        { en: "Continue the loop while the number is greater than zero.", uz: "Son noldan katta ekan siklni davom ettiring." }
      ],
      starter: `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter a positive integer: ";
    cin >> n;

    int sum = 0;

    // TODO: Use a while loop to sum digits of n
    // TODO: n ning raqamlari yig'indisini topish uchun while siklidan foydalaning


    cout << "Sum of digits = " << sum << endl;
    return 0;
}`
    },
    {
      title_en: "Coding Problem 2 — Average of Array",
      title_uz: "2-Kodlash Masalasi — Massiv O'rtachasi",
      en: [
        "Declare an array of 6 integers.",
        "Read 6 numbers from the user into the array.",
        "Calculate and display the average (as a <code>double</code>).",
        "Example: input 4 6 8 2 10 6 → Average = 6.0"
      ],
      uz: [
        "6 ta butun sonli massiv e'lon qiling.",
        "Foydalanuvchidan 6 ta sonni massivga o'qing.",
        "O'rtacha qiymatni hisoblang va ko'rsating (<code>double</code> sifatida).",
        "Misol: kirish 4 6 8 2 10 6 → Average = 6.0"
      ],
      hints: [
        { en: "Average = sum of all elements divided by the number of elements.", uz: "O'rtacha = barcha elementlar yig'indisini elementlar soniga bo'lish." },
        { en: "Use <code>for</code> loop to read and accumulate the sum.", uz: "O'qish va yig'indini to'plash uchun <code>for</code> siklini ishlating." },
        { en: "To avoid integer division, cast to double or divide by <code>6.0</code>.", uz: "Butun bo'lishni oldini olish uchun double ga o'tkazing yoki <code>6.0</code> ga bo'ling." }
      ],
      starter: `#include <iostream>
using namespace std;

int main() {
    int arr[6];
    int sum = 0;

    cout << "Enter 6 numbers: ";

    // TODO: Read 6 numbers into arr and add them to sum
    // TODO: 6 ta sonni arr ga o'qing va sum ga qo'shing


    double average = 0.0;
    // TODO: Calculate average (use a double to avoid integer division)
    // TODO: O'rtachani hisoblang (butun bo'lishdan qochish uchun double ishlating)


    cout << "Average = " << average << endl;
    return 0;
}`
    }
  ]
};
