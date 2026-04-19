// ===============================================================
// Reference solutions for each version — used in PDF report
// ===============================================================

window.SOLUTIONS = {
  A: [
    // Problem 1: Sum of odd numbers 1 to 50
    `#include <iostream>
using namespace std;

int main() {
    int sum = 0;

    for (int i = 1; i <= 50; i++) {
        if (i % 2 == 1) {
            sum += i;
        }
    }

    cout << "Sum of odd numbers = " << sum << endl;
    return 0;
}`,
    // Problem 2: Reverse an array of 6
    `#include <iostream>
using namespace std;

int main() {
    int arr[6];

    cout << "Enter 6 numbers: ";
    for (int i = 0; i < 6; i++) {
        cin >> arr[i];
    }

    cout << "Reversed: ";
    for (int i = 5; i >= 0; i--) {
        cout << arr[i] << " ";
    }

    cout << endl;
    return 0;
}`
  ],

  B: [
    // Problem 1: findMax of three numbers
    `#include <iostream>
using namespace std;

int findMax(int a, int b, int c);

int main() {
    int a, b, c;
    cout << "Enter 3 numbers: ";
    cin >> a >> b >> c;

    int result = findMax(a, b, c);
    cout << "Maximum = " << result << endl;
    return 0;
}

int findMax(int a, int b, int c) {
    int max = a;
    if (b > max) max = b;
    if (c > max) max = c;
    return max;
}`,
    // Problem 2: Count uppercase letters
    `#include <iostream>
#include <string>
using namespace std;

int main() {
    string word;
    cout << "Enter a word: ";
    cin >> word;

    int count = 0;

    for (int i = 0; i < word.length(); i++) {
        char c = word[i];
        if (c >= 'A' && c <= 'Z') {
            count++;
        }
    }

    cout << "Uppercase: " << count << endl;
    return 0;
}`
  ],

  C: [
    // Problem 1: Sum of digits using while
    `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter a positive integer: ";
    cin >> n;

    int sum = 0;

    while (n > 0) {
        sum += n % 10;
        n = n / 10;
    }

    cout << "Sum of digits = " << sum << endl;
    return 0;
}`,
    // Problem 2: Average of array
    `#include <iostream>
using namespace std;

int main() {
    int arr[6];
    int sum = 0;

    cout << "Enter 6 numbers: ";
    for (int i = 0; i < 6; i++) {
        cin >> arr[i];
        sum += arr[i];
    }

    double average = sum / 6.0;

    cout << "Average = " << average << endl;
    return 0;
}`
  ],

  D: [
    // Problem 1: 5x5 multiplication table
    `#include <iostream>
using namespace std;

int main() {
    cout << "Multiplication table 5x5:" << endl;

    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= 5; j++) {
            cout << i * j << "\\t";
        }
        cout << endl;
    }

    return 0;
}`,
    // Problem 2: Count vowels
    `#include <iostream>
#include <string>
using namespace std;

int main() {
    string word;
    cout << "Enter a word: ";
    cin >> word;

    int vowelCount = 0;

    for (int i = 0; i < word.length(); i++) {
        char c = word[i];
        if (c == 'a' || c == 'e' || c == 'i' ||
            c == 'o' || c == 'u') {
            vowelCount++;
        }
    }

    cout << "Vowels: " << vowelCount << endl;
    return 0;
}`
  ]
};
