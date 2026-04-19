// ===============================================================
// Exam Version A
// ===============================================================

window.VERSION_A = {
  id: "A",
  shuffleSeed: "A_2026_CPPv1",
  coding: [
    {
      title_en: "Coding Problem 1 — Sum of Odd Numbers",
      title_uz: "1-Kodlash Masalasi — Toq Sonlar Yig'indisi",
      en: [
        "Use a <code>for</code> loop to go through numbers from 1 to 50.",
        "Calculate the sum of ALL odd numbers in that range.",
        "Display the final sum.",
        "Expected output: <code>Sum of odd numbers = 625</code>"
      ],
      uz: [
        "1 dan 50 gacha sonlar bo'yicha <code>for</code> siklini ishlating.",
        "Ushbu oraliqdagi BARCHA toq sonlar yig'indisini hisoblang.",
        "Yakuniy yig'indini ko'rsating.",
        "Kutilgan natija: <code>Sum of odd numbers = 625</code>"
      ],
      hints: [
        { en: "You will need a loop and a condition inside it.", uz: "Sizga sikl va uning ichida shart kerak bo'ladi." },
        { en: "An odd number leaves a remainder of 1 when divided by 2 (use the <code>%</code> operator).", uz: "Toq son 2 ga bo'linganda 1 qoldiq qoldiradi (<code>%</code> operatoridan foydalaning)." },
        { en: "Keep a running total in a variable and add to it only when the condition is met.", uz: "O'zgaruvchida jami yig'indini saqlang va shart bajarilganda unga qo'shing." }
      ],
      starter: `#include <iostream>
using namespace std;

int main() {
    int sum = 0;

    // TODO: Loop through numbers 1 to 50 and add odd numbers to sum
    // TODO: 1 dan 50 gacha sonlar bo'ylab sikl yozing va toq sonlarni sum ga qo'shing


    cout << "Sum of odd numbers = " << sum << endl;
    return 0;
}`
    },
    {
      title_en: "Coding Problem 2 — Reverse an Array",
      title_uz: "2-Kodlash Masalasi — Massivni Teskari Chop Etish",
      en: [
        "Declare an integer array of size 6.",
        "Read 6 numbers from the user into the array.",
        "Print the array elements in REVERSE order (from last to first).",
        "Example: input <code>1 2 3 4 5 6</code> → output <code>6 5 4 3 2 1</code>"
      ],
      uz: [
        "6 o'lchamli butun sonli massiv e'lon qiling.",
        "Foydalanuvchidan 6 ta sonni massivga o'qing.",
        "Massiv elementlarini TESKARI tartibda chop eting (oxirgidan birinchigacha).",
        "Misol: kirish <code>1 2 3 4 5 6</code> → natija <code>6 5 4 3 2 1</code>"
      ],
      hints: [
        { en: "Use one <code>for</code> loop to read 6 values, and another to print in reverse.", uz: "6 ta qiymatni o'qish uchun bitta <code>for</code> sikli, teskari chop etish uchun boshqasini ishlating." },
        { en: "Array indexes go from 0 to size - 1. The last element is at index 5.", uz: "Massiv indekslari 0 dan size-1 gacha. Oxirgi element 5 indeksida." },
        { en: "For reverse iteration, decrement the counter: <code>i--</code>.", uz: "Teskari takrorlash uchun hisoblagichni kamaytiring: <code>i--</code>." }
      ],
      starter: `#include <iostream>
using namespace std;

int main() {
    int arr[6];

    cout << "Enter 6 numbers: ";

    // TODO: Read 6 numbers into the array
    // TODO: 6 ta sonni massivga o'qing


    cout << "Reversed: ";

    // TODO: Print array elements from last to first
    // TODO: Massiv elementlarini oxirgidan birinchiga chop eting


    cout << endl;
    return 0;
}`
    }
  ]
};
