// ===============================================================
// Exam Version D
// ===============================================================

window.VERSION_D = {
  id: "D",
  shuffleSeed: "D_2026_CPPv1",
  coding: [
    {
      title_en: "Coding Problem 1 — Multiplication Table",
      title_uz: "1-Kodlash Masalasi — Ko'paytirish Jadvali",
      en: [
        "Use nested <code>for</code> loops to print a 5x5 multiplication table.",
        "Each row represents i (1-5), each column represents j (1-5).",
        "Print each product separated by a tab character (<code>\\t</code>).",
        "After each row, print a newline. Output for row 3: <code>3 6 9 12 15</code>"
      ],
      uz: [
        "5x5 ko'paytirish jadvalini chop etish uchun ichma-ich <code>for</code> sikllaridan foydalaning.",
        "Har bir qator i ni (1-5), har bir ustun j ni (1-5) ifodalaydi.",
        "Har bir ko'paytmani tab belgisi (<code>\\t</code>) bilan ajrating.",
        "Har bir qatordan keyin yangi qator chop eting. 3-qator uchun natija: <code>3 6 9 12 15</code>"
      ],
      hints: [
        { en: "Use TWO for loops, one inside the other (nested).", uz: "IKKITA for siklidan foydalaning, biri ikkinchisi ichida (ichma-ich)." },
        { en: "The outer loop controls the row (i), the inner loop controls the column (j).", uz: "Tashqi sikl qatorni (i), ichki sikl ustunni (j) nazorat qiladi." },
        { en: "Print <code>i * j</code> inside the inner loop; print <code>endl</code> after the inner loop.", uz: "Ichki sikl ichida <code>i * j</code> chop eting; ichki sikldan keyin <code>endl</code> chop eting." }
      ],
      starter: `#include <iostream>
using namespace std;

int main() {
    cout << "Multiplication table 5x5:" << endl;

    // TODO: Write nested for loops to print 5x5 multiplication table
    // TODO: 5x5 ko'paytirish jadvalini chop etish uchun ichma-ich for sikllarini yozing


    return 0;
}`
    },
    {
      title_en: "Coding Problem 2 — Count Vowels",
      title_uz: "2-Kodlash Masalasi — Unlilarni Sanash",
      en: [
        "Ask the user to enter a word.",
        "Count how many vowels (a, e, i, o, u — lowercase) appear in the word.",
        "Use a <code>for</code> loop to check each character.",
        "Display the count. Example: \"education\" → Vowels: 5"
      ],
      uz: [
        "Foydalanuvchidan so'z kiritishni so'rang.",
        "So'zdagi unli harflar (a, e, i, o, u — kichik harflar) sonini sanang.",
        "Har bir belgini tekshirish uchun <code>for</code> siklidan foydalaning.",
        "Sonni ko'rsating. Misol: \"education\" → Vowels: 5"
      ],
      hints: [
        { en: "Access each character using <code>word[i]</code>.", uz: "Har bir belgiga <code>word[i]</code> orqali murojaat qiling." },
        { en: "Compare the character against each vowel using <code>==</code> and the <code>||</code> operator.", uz: "Belgini har bir unli bilan <code>==</code> va <code>||</code> operatorlari orqali solishtiring." },
        { en: "Increment the count each time you find a vowel.", uz: "Unli topganingizda hisobni oshirib boring." }
      ],
      starter: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string word;
    cout << "Enter a word: ";
    cin >> word;

    int vowelCount = 0;

    // TODO: Loop through each character of word
    // TODO: word ning har bir belgisi bo'ylab sikl yurging


        // TODO: If character is a vowel (a,e,i,o,u), increment vowelCount
        // TODO: Agar belgi unli (a,e,i,o,u) bo'lsa, vowelCount ni oshiring



    cout << "Vowels: " << vowelCount << endl;
    return 0;
}`
    }
  ]
};
