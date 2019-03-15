package com.example.tdmpaises;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.SpinnerAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    Spinner spinner;

    List<Country> countries = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        spinner = findViewById(R.id.spinner);

        countries.add(new Country(1,"Mexico", "14 km2", "500"));
        countries.add(new Country(2,"Estados Unidos", "14 km2", "500"));
        countries.add(new Country(3,"Canadá", "14 km2", "500"));
        countries.add(new Country(4,"Argentina", "14 km2", "500"));

        spinner.setAdapter(new ArrayAdapter<Country>(this, android.R.layout.simple_spinner_item, countries));

    }
}
