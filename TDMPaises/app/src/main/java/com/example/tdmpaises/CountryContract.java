package com.example.tdmpaises;

import android.provider.BaseColumns;

public final class CountryContract {

    public static class CountryEntry implements BaseColumns {
        public static final String TABLE_NAME ="countries";

        public static final String _ID = "id";
        public static final String NAME = "name";
        public static final String AREA = "area";
        public static final String POPULATION = "population";
    }
}
