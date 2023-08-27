interface ConvertStringToKodePasarParams {
  data_array: any[];
  pasaran: any;
}

const convert_string_to_kode_pasar = (
  params: ConvertStringToKodePasarParams
) => {
  const { pasaran } = params;
  const all_kode_pasar: any[] = [];

  params.data_array.forEach(data => {
    const updated_data = { ...data };

    if (data.pasaran[pasaran]) {
      updated_data.pasaran = data.pasaran[pasaran];
    }

    all_kode_pasar.push(updated_data);
  });

  return all_kode_pasar;
};

export { convert_string_to_kode_pasar };
