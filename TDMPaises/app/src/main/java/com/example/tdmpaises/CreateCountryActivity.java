package com.example.tdmpaises;

import android.app.Activity;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.channels.FileChannel;

public class CreateCountryActivity extends AppCompatActivity implements View.OnClickListener {

    public static final int PICK_IMAGE_REQUEST_CODE = 3212;

    EditText txtName;
    EditText txtArea;
    EditText txtPopulation;
    ImageView btnImage;

    String image = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_country);

        txtName = findViewById(R.id.txtNombre);
        txtArea = findViewById(R.id.txtArea);
        txtPopulation = findViewById(R.id.txtPopulation);
        btnImage = findViewById(R.id.btnImage);

        findViewById(R.id.btnSave).setOnClickListener(this);
        btnImage.setOnClickListener(this);

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
                            Integer.parseInt(txtArea.getText().toString()),
                            image
                    )
            ));

            setResult(MainActivity.CREATE_COUNTRY_REQUEST_CODE, resultIntent);
            finish();
        }

        if (v.getId() == R.id.btnImage) {
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            startActivityForResult(Intent.createChooser(intent, "Selecciona una imagen"), PICK_IMAGE_REQUEST_CODE);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (resultCode == Activity.RESULT_OK)
            switch (requestCode) {
                case PICK_IMAGE_REQUEST_CODE:
                    Uri selectedImage = data.getData();
                    btnImage.setImageURI(selectedImage);
                    btnImage.setImageTintList(null);
                    image =  "image" + MainActivity.countries.size() + ".png";

                    try {
                        Bitmap bmp = MediaStore.Images.Media.getBitmap(this.getContentResolver(), selectedImage);
                        try (FileOutputStream out = new FileOutputStream(getApplicationContext().getFilesDir().getPath() + image)) {
                            bmp.compress(Bitmap.CompressFormat.PNG, 100, out);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    break;
            }

    }

}
