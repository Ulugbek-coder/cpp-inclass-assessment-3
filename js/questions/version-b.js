// ===============================================================
// Exam Version B
// ===============================================================

window.VERSION_B = {
  id: "B",
  shuffleSeed: "B_2026_CPPv1",
  coding: [
    {
      title_en: "Coding Problem 1 — Find Maximum of Three Numbers",
      title_uz: "1-Kodlash Masalasi — Uchta Sondan Eng Kattasini Topish",
      en: [
        "Write a function <code>int findMax(int a, int b, int c)</code> that returns the largest of three numbers.",
        "Declare the function prototype before <code>main()</code>.",
        "In <code>main()</code>, ask the user for 3 numbers.",
        "Call the function and display the maximum. Example: 5 8 3 → Maximum = 8"
      ],
      uz: [
        "Uchta sondan eng kattasini qaytaradigan <code>int findMax(int a, int b, int c)</code> funksiyasini yozing.",
        "Funksiya prototipini <code>main()</code> dan oldin e'lon qiling.",
        "<code>main()</code> da foydalanuvchidan 3 ta son so'rang.",
        "Funksiyani chaqiring va maksimumni ko'rsating. Misol: 5 8 3 → Maximum = 8"
      ],
      hints: [
        { en: "A function has three parts: prototype (declaration), call in <code>main()</code>, and definition.", uz: "Funksiyaning uchta qismi bor: prototip (e'lon), <code>main()</code> da chaqirilish va aniqlash." },
        { en: "Use <code>if-else if-else</code> to compare the three numbers.", uz: "Uchta sonni solishtirish uchun <code>if-else if-else</code> ishlating." },
        { en: "A simpler trick: start with <code>max = a</code>, then check if b or c is greater.", uz: "Osonroq usul: <code>max = a</code> dan boshlang, keyin b yoki c kattaroqmi tekshiring." }
      ],
      starter: `#include <iostream>
using namespace std;

// TODO: Declare function prototype for findMax
// TODO: findMax uchun funksiya prototipini e'lon qiling


int main() {
    int a, b, c;
    cout << "Enter 3 numbers: ";
    cin >> a >> b >> c;

    // TODO: Call findMax and store the result
    // TODO: findMax ni chaqiring va natijani saqlang


    cout << "Maximum = " << /* result */ 0 << endl;
    return 0;
}

// TODO: Define the findMax function below
// TODO: findMax funksiyasini quyida aniqlang
`
    },
    {
      title_en: "Coding Problem 2 — Count Uppercase Letters",
      title_uz: "2-Kodlash Masalasi — Katta Harflarni Sanash",
      en: [
        "Ask the user to enter a word (no spaces).",
        "Use a <code>for</code> loop to go through each character.",
        "Count how many characters are UPPERCASE letters (A to Z).",
        "Display the count. Example: input \"HelloWorld\" → Uppercase: 2"
      ],
      uz: [
        "Foydalanuvchidan so'z kiritishni so'rang (bo'shliqsiz).",
        "Har bir belgidan o'tish uchun <code>for</code> siklidan foydalaning.",
        "Qancha belgi KATTA harf (A dan Z gacha) ekanligini sanang.",
        "Sonni ko'rsating. Misol: kirish \"HelloWorld\" → Uppercase: 2"
      ],
      hints: [
        { en: "You can check if a character is uppercase using the ASCII range: <code>c >= 'A' && c <= 'Z'</code>.", uz: "Belgining katta harfligini ASCII oraliq orqali tekshirishingiz mumkin: <code>c >= 'A' && c <= 'Z'</code>." },
        { en: "Use <code>s.length()</code> to get the number of characters in the string.", uz: "Satrdagi belgilar sonini olish uchun <code>s.length()</code> ishlating." },
        { en: "Keep a counter variable; increment it only when the condition is true.", uz: "Hisoblagich o'zgaruvchi saqlang; shart to'g'ri bo'lganda uni oshiring." }
      ],
      starter: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string word;
    cout << "Enter a word: ";
    cin >> word;

    int count = 0;

    // TODO: Loop through each character of word
    // TODO: word ning har bir belgisi bo'ylab sikl yurging


        // TODO: If the character is uppercase (A-Z), increment count
        // TODO: Agar belgi katta harf bo'lsa (A-Z), count ni oshiring



    cout << "Uppercase: " << count << endl;
    return 0;
}`
    }
  ]
};
