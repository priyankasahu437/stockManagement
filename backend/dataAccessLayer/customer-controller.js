
const RegisterCustomer = (request, response) => {
    try {

        let params = request.body;

                    let query = `INSERT INTO customer
                    (address_1, address_2, city, country, credit_card, day_phone, email, eve_phone, mob_phone, name, password, postal_code, region, shipping_region_id)
                    values
                    (
                        '${params.AddressOne}', 
                        '${params.AddressTwo}', 
                        '${params.Town}', 
                        '${params.Country}', 
                        '${params.CreditCard}', 
                        '', 
                        '${params.Email}', 
                        '', 
                        '${params.Mobile}', 
                        '${params.FirstName}', 
                        '', 
                        '${params.ZipCode}', 
                        '',
                        ${params.RegionId});`; // query database to get all the  Shipping Regions
            
                    // execute query
                    db.query(query, (err, result) => {
                       if (err != null) response.status(500).send({ error: err.message });
            
                       return response.json(true);
                   });
    } catch (error) {
        if (error != null) response.status(500).send({ error: error.message });
    }
};

// validate login details and sign in
const AuthenticateLogin = (request, response) => {
    try {
        let params = request.body;
                let query = `SELECT 
                    A.email AS 'Email',
                    A.password AS 'Password',
                    A.address_1 AS 'AddressOne',
                    A.address_2 AS 'AddressTwo',
                    A.city AS 'Town',
                    A.country AS 'Country',
                    A.credit_card AS 'CreditCard',
                    A.customer_id AS 'CustomerId',
                    A.mob_phone AS 'Mobile',
                    A.name AS 'FullName',
                    A.postal_code AS 'ZipCode',
                    A.shipping_region_id AS 'RegionId'
                    FROM  customer A
                    WHERE A.email = '${params.Username}';`; // query database to get all the  Shipping Regions

                // execute query
                db.query(query, (err, result) => {
                    if (err != null) response.status(500).send({ error: err.message });
                    return response.json(result);
                });
    } catch (error) {
        if (error != null) response.status(500).send({ error: error.message });
    }
};

const Logout = (request, response) => {
    try {
            return response.json(request);
    } catch (error) {
        if (error != null) response.status(500).send({ error: error.message });
    }
};


const customer = {
    RegisterCustomer,
    AuthenticateLogin,
    Logout
};

module.exports = customer;