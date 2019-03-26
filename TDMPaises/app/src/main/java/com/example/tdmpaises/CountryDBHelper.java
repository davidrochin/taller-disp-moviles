package com.example.tdmpaises;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.net.Uri;
import android.util.Log;

import com.example.tdmpaises.CountryContract.CountryEntry;

import java.util.ArrayList;
import java.util.List;

public class CountryDBHelper extends SQLiteOpenHelper {

    public static final int DATABASE_VERSION = 1;
    public static final String DATABASE_NAME = "local.db";

    SQLiteDatabase db;

    public CountryDBHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        db = getWritableDatabase();
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        Log.d(getClass().getSimpleName(), "Creating database...");

        db.execSQL("CREATE TABLE " + "countries" + " ("
                + CountryEntry._ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + CountryEntry.NAME + " TEXT NOT NULL,"
                + CountryEntry.AREA + " INTEGER NOT NULL,"
                + CountryEntry.POPULATION + " INTEGER NOT NULL,"
                + CountryEntry.IMAGE + " TEXT)");

        Log.d(getClass().getSimpleName(), "Inserting data...");

        this.db = db;

        save(new Country("México", 1973, 1292));
        save(new Country("Estados Unidos", 9834, 3272));
        save(new Country("Canadá", 9985, 37060));
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }

    public List<Country> getAll() {
        Cursor cursor = db.rawQuery("SELECT * FROM " + CountryContract.CountryEntry.TABLE_NAME, new String[0]);

        List<Country> countries = new ArrayList<>();

        while (cursor.moveToNext()) {
            Country country = new Country(
                    cursor.getInt(cursor.getColumnIndex(CountryEntry._ID)),
                    cursor.getString(cursor.getColumnIndex(CountryContract.CountryEntry.NAME)),
                    cursor.getFloat(cursor.getColumnIndex(CountryEntry.AREA)),
                    cursor.getInt(cursor.getColumnIndex(CountryEntry.POPULATION))
            );

            String imageUriString = cursor.getString(cursor.getColumnIndex(CountryEntry.IMAGE));
            if(imageUriString != null){
                country.setImage(imageUriString);
            }

            countries.add(country);
        }

        return countries;
    }

    public void save(Country country){
        ContentValues values = new ContentValues();

        if(country.getId() != -1){
            values.put(CountryEntry._ID, country.getId());
        }
        values.put(CountryEntry.NAME, country.getName());
        values.put(CountryEntry.AREA, country.getArea());
        values.put(CountryEntry.POPULATION, country.getPopulation());

        if(country.getImage() != null){
            values.put(CountryEntry.IMAGE, country.getImage());
        }

        db.insert(CountryEntry.TABLE_NAME, null, values);
    }
}
