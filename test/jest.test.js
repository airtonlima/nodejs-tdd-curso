test.skip('Devo conhecer as principais assertivas do jest', () => {

    let number = null;
    
    expect(number).toBeNull();

    number = 10;

    expect(number).not.toBeNull();

    expect(number).toBe(10);

    expect(number).toEqual(10);

    expect(number).toBeGreaterThan(9);

    expect(number).toBeLessThan(11);
});

test.skip('Devo saber trabalhar com objetos', () => {

    const obj = { name: 'Airton', email: 'airton@wesoft.com.br' };

    expect(obj).toHaveProperty('name');
    expect(obj).toHaveProperty('name', 'Airton');
    expect(obj.name).toBe('Airton');

    const obj2 = { name: 'Airton', email: 'airton@wesoft.com.br' };
    expect(obj).toEqual(obj2);
});