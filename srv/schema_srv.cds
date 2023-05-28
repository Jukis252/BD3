using db from '../db/schema';
service UI 
{
    @cds.persistence.exists
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

    @cds.persistence.exists
    entity FILM 
    {
        key
        ID: Integer not null;
        NAME: String(256);
        AUTHOR: String(256);
        PRICE: Integer;
        RELEASE_DATE: DateTime;
    }

    @cds.persistence.exists
    entity PEOPLE 
    {
        key
        ID: Integer not null;
        FIRST_NAME: String(256);
        LAST_NAME: String(256);
        SALARY: Integer;
        START_DATE: DateTime;  
    }

    @cds.persistence.exists
    entity PRODUCT
    {
        key
        ID: Integer not null;
        NAME: String(256);
        PRICE: Integer;
        QUANTITY: Integer;
        END_DATE: DateTime;
    }
    @cds.persistence.exists
    entity CAR
    {
        key
        ID: Integer not null;
        NAME: String(256);
        MODEL: String(256);
        PRICE: Integer;
        RELEASE_DATE: DateTime;      
    }

    @cds.persistence.exists
    entity ALLDATA
    {
        key
        BOOK_ID: Integer not null;
        BOOK_NAME: String(256);
        BOOK_PRICE: Integer;
        BOOK_RELEASE_DATE: DateTime;
        BOOK_QUANTITY: Integer NOT null;
        FILM_ID: Integer not null;
        FILM_NAME: String(256);
        FILM_DIRECTOR: String(256);
        FILM_PRICE: Integer;
        FILM_RELEASE_DATE: DateTime;
        CAR_ID: Integer not null;
        MANUFACTURER: String(256);
        CAR_MODEL: String(256);
        CAR_PRICE: Integer;
        CAR_RELEASE_DATE: DateTime; 
        PEOPLE_ID: Integer not null;
        PEOPLE_FIRST_NAME: String(256);
        PEOPLE_LAST_NAME: String(256);
        PEOPLE_SALARY: Integer;
        PEOPLE_START_DATE: DateTime;  
        PRODUCT_ID: Integer not null;
        PRODUCT_NAME: String(256);
        PRODUCT_PRICE: Integer;
        PRODUCT_QUANTITY: Integer;
        PRODUCT_EXPIRE_DATE: DateTime;
    }

    @cds.persistence.exists
    entity REPORTS
    {
        ID: Integer NOT null;
        NAME: String(256);
        ITEM: String(4999);
    }

    @cds.persistence.exists
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
}
