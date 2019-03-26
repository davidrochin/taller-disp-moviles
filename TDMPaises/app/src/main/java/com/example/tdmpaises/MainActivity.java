package com.example.tdmpaises;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.SpinnerAdapter;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements View.OnClickListener, AdapterView.OnItemSelectedListener {

    public static int CREATE_COUNTRY_REQUEST_CODE = 8000;

    EditText txtName;
    EditText txtArea;
    EditText txtPopulation;
    Spinner spinner;
    ImageView imgCountry;

    public static List<Country> countries = new ArrayList<>();

    CountryDBHelper countryDB;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        spinner = findViewById(R.id.spinner);

        txtName = findViewById(R.id.txtName);
        txtArea = findViewById(R.id.txtArea);
        txtPopulation = findViewById(R.id.txtPopulation);
        imgCountry = findViewById(R.id.imgCountry);

        spinner.setOnItemSelectedListener(this);

        countryDB = new CountryDBHelper(this);

        refreshCountries();

        ((Button)findViewById(R.id.btnAdd)).setOnClickListener(this);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if(requestCode == CREATE_COUNTRY_REQUEST_CODE && data != null){
            String json = data.getStringExtra("COUNTRY");

            Country country = new Gson().fromJson(json, Country.class);

            countryDB.save(country);

            Toast toast = Toast.makeText(this, "Guardado con éxito", Toast.LENGTH_LONG);
            toast.show();

            refreshCountries();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public void onClick(View v) {
        if(v.getId() == R.id.btnAdd){
            startActivityForResult(new Intent(this, CreateCountryActivity.class), CREATE_COUNTRY_REQUEST_CODE);
        }
    }

    public void refreshCountries(){
        countries.clear();
        for (Country c : countryDB.getAll()){
            countries.add(c);
        }
        spinner.setAdapter(new ArrayAdapter<Country>(this, R.layout.spinner_item, countries));
    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        Country country = (Country) parent.getSelectedItem();

        txtName.setText(country.getName());
        txtArea.setText(country.getArea() + " km/2");
        txtPopulation.setText(country.getPopulation() + " millones");

        if(country.getImage() != null){
            File imgFile = new  File(this.getApplicationContext().getFilesDir().getPath() + country.getImage());
            if(imgFile.exists()){
                Bitmap myBitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());
                //Drawable d = new BitmapDrawable(getResources(), myBitmap);
                imgCountry.setImageBitmap(myBitmap);
            }
        } else {
            imgCountry.setImageBitmap(null);
        }

    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {
        txtName.setText("");
        txtArea.setText("");
        txtPopulation.setText("");
    }
}
