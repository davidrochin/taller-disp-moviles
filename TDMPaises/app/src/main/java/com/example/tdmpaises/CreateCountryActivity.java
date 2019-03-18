package com.example.tdmpaises;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;

import com.google.gson.Gson;

public class CreateCountryActivity extends AppCompatActivity implements View.OnClickListener {

    EditText txtName;
    EditText txtArea;
    EditText txtPopulation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_country);

        txtName = findViewById(R.id.txtNombre);
        txtArea = findViewById(R.id.txtArea);
        txtPopulation = findViewById(R.id.txtPopulation);

        findViewById(R.id.btnSave).setOnClickListener(this);

        getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btnSave) {
            Intent resultIntent = new Intent();
            resultIntent.putExtra("COUNTRY", new Gson().toJson(
                    new Country(
                            txtName.getText().toString(),
                            Float.parseFloat(txtArea.getText().toString()),
                            Integer.parseInt(txtArea.getText().toString())
                    )
            ));

            setResult(MainActivity.CREATE_COUNTRY_REQUEST_CODE, resultIntent);
            finish();
        }
    }
}
