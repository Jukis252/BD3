namespace db;

entity BOOK 
    {
        key
        ID: Integer not null;
        NAME: String(256);
        AUTHOR: String(256);
        PRICE: Integer;
        RELEASE_DATE: DateTime;
        QUANTITY: Integer;
    }


    entity FILM 
    {
        key
        ID: Integer not null;
        NAME: String(256);
        AUTHOR: String(256);
        PRICE: Integer;
        RELEASE_DATE: DateTime;
    }


    entity PEOPLE 
    {
        key
        ID: Integer not null;
        FIRST_NAME: String(256);
        LAST_NAME: String(256);
        SALARY: Integer;
        START_DATE: DateTime;  
    }


    entity PRODUCT
    {
        key
        ID: Integer not null;
        NAME: String(256);
        PRICE: Integer;
        QUANTITY: Integer;
        END_DATE: DateTime;
    }

    entity CAR
    {
        key
        ID: Integer not null;
        NAME: String(256);
        MODEL: String(256);
        PRICE: Integer;
        RELEASE_DATE: DateTime;      
    }

    entity REPORTS
    {
        ID: Integer NOT null;
        NAME: String(256);
        ITEM: String(4999);
    }

    entity variants
    {
        key 
        id               : Integer;
        fileName         : String(255);
        fileType         : String(10);
        changeType       : String(40);
        reference        : String(100);
        packageName      : String(100);
        content          : LargeString;
        namespace        : String(100);
        creation         : DateTime default current_timestamp;
        originalLanguage : String(2);
        conditions       : String(254);
        context          : String(254);
        supportGenerator : String(100);
        supportService   : String(30);
        supportUser      : String(100);
        layer            : String(20);
        selector         : String(255);
        texts            : LargeString;
        variantName      : String(255);
    }


