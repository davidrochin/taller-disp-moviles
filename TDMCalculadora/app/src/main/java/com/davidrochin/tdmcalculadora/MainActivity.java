package com.davidrochin.tdmcalculadora;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    Button[] numButtons = new Button[10];
    Button btnPeriod, btnEquals, btnAddition, btnSubstraction, btnMultiplication, btnDivision, btnReset;

    TextView screen;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        screen = findViewById(R.id.txtScreen);

        numButtons[0] = findViewById(R.id.btn0);
        numButtons[1] = findViewById(R.id.btn1);
        numButtons[2] = findViewById(R.id.btn2);
        numButtons[3] = findViewById(R.id.btn3);
        numButtons[4] = findViewById(R.id.btn4);
        numButtons[5] = findViewById(R.id.btn5);
        numButtons[6] = findViewById(R.id.btn6);
        numButtons[7] = findViewById(R.id.btn7);
        numButtons[8] = findViewById(R.id.btn8);
        numButtons[9] = findViewById(R.id.btn9);

        btnPeriod = findViewById(R.id.btnDot);
        btnEquals = findViewById(R.id.btnEquals);
        btnAddition = findViewById(R.id.btnAddition);
        btnSubstraction = findViewById(R.id.btnSubstraction);
        btnMultiplication = findViewById(R.id.btnMultiplication);
        btnDivision = findViewById(R.id.btnDivision);
        btnReset = findViewById(R.id.btnReset);

        for(Button b : numButtons){
            b.setOnClickListener(numListener);
        }

        btnPeriod.setOnClickListener(otherListener);
        btnEquals.setOnClickListener(otherListener);
        btnAddition.setOnClickListener(otherListener);
        btnSubstraction.setOnClickListener(otherListener);
        btnMultiplication.setOnClickListener(otherListener);
        btnDivision.setOnClickListener(otherListener);
        btnReset.setOnClickListener(otherListener);

    }

    private View.OnClickListener numListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            for (int i = 0; i < numButtons.length; i++){

                // Encontrar que botón se presionó
                if(v == numButtons[i]){
                    int n = i;
                    addText("" + n);
                }
            }
        }
    };

    private View.OnClickListener otherListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            switch(v.getId()){
                case R.id.btnDot: {
                    if(lastCharacterIsNumber()){
                        addText(".");
                    }
                    break;
                }
                case R.id.btnAddition:{
                    if(lastCharacterIsNumber()){
                        addText("+");
                    }
                    break;
                }
                case R.id.btnSubstraction:{
                    if(lastCharacterIsNumber()){
                        addText("-");
                    }
                    break;
                }
                case R.id.btnMultiplication:{
                    if(lastCharacterIsNumber()){
                        addText("*");
                    }
                    break;
                }
                case R.id.btnDivision:{
                    if(lastCharacterIsNumber()){
                        addText("/");
                    }
                    break;
                }
                case R.id.btnReset:{
                    screen.setText("");
                    break;
                }
                case R.id.btnEquals:{
                    calculate();
                    break;
                }
            }
        }
    };

    private void addText(String text){
        screen.setText(screen.getText().toString() + text);
    }

    private boolean lastCharacterIsNumber(){

        int lastPos = screen.getText().toString().length() - 1;

        if(lastPos >= 0 && lastPos < screen.getText().toString().length()){
            char last = screen.getText().toString().charAt(lastPos);
            return Character.isDigit(last);
        } else {
            return false;
        }

    }

    private void calculate(){
        String raw = screen.getText().toString();

        boolean firstIsNegative = raw.charAt(0) == '-';
        if(firstIsNegative) {
            raw = raw.substring(1);
        }

        // Separar los numeros de los simbolos
        String[] nums = raw.split("\\+|\\-|\\*|\\/");
        char[] ops = new char[nums.length - 1];

        int currentOps = 0;
        for(int i = 0; i < raw.length(); i++){
            if(raw.charAt(i) == '+' || raw.charAt(i) == '-' || raw.charAt(i) == '*' || raw.charAt(i) == '/'){
                ops[currentOps] = raw.charAt(i);
                currentOps++;
            }
        }

        // Calcular el resultado
        float result = Float.parseFloat(nums[0]);
        if(firstIsNegative){
            result *= -1;
        }
        for(int i = 0; i < ops.length; i++){
            float next = Float.parseFloat(nums[i + 1]);

            switch(ops[i]){
                case '+':
                    result += next;
                    break;
                case '-':
                    result -= next;
                    break;
                case '*':
                    result *= next;
                    break;
                case '/':
                    result /= next;
                    break;
            }
        }

        screen.setText("" + result);
    }
}
