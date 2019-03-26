package com.example.tdmpaises;

import android.net.Uri;

public class Country {

    private int id = -1;
    private String name;
    private float area;
    private int population;
    private String image;

    public Country(String name, float area, int population) {
        this.name = name;
        this.area = area;
        this.population = population;
    }

    public Country(int id, String name, float area, int population) {
        this.id = id;
        this.name = name;
        this.area = area;
        this.population = population;
    }

    public Country(String name, float area, int population, String image) {
        this.id = id;
        this.name = name;
        this.area = area;
        this.population = population;
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getArea() {
        return area;
    }

    public void setArea(float area) {
        this.area = area;
    }

    public int getPopulation() {
        return population;
    }

    public void setPopulation(int population) {
        this.population = population;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public String toString() {
        return name;
    }
}
