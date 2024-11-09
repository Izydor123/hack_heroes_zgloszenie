import pandasdmx as sdmx
import pandas as pd

def import_data(region: str) -> pd.DataFrame:
    try:

        dataRequest = sdmx.Request('ESTAT')
        dataResponse = dataRequest.data(resource_id='ten00110')
        dataset = dataResponse.to_pandas().to_frame()

        dataset.reset_index(inplace=True)

        dataset = dataset.dropna()

        dataset.sort_values(by=['geo'])

        countryKeys = dataset.geo.unique().tolist()
        countryNewValues =  ['Albania', 'Austria', 'Bośnia i Hercegowina', 'Belgia', 'Bułgaria', 'Cypr', 'Czechy', 'Niemcy', 'Dania', 'Estonia', 'Grecja', 'Hiszpania', 'Kraje Unii Europejskiej(od 2020)',
                    'Finlandia', 'Francja', 'Chorwacja', 'Węgry', 'Irlandia', 'Islandia', 'Włochy', 'Liechtenstein', 'Litwa', 'Luksemburg', 'Łotwa', 'Czarnogóra', 
                    'Macedonia Północna', 'Malta', 'Holandia', 'Norwegia', 'Polska', 'Portugalia', 'Rumunia', 'Serbia', 'Szwecja', 'Słowenia', 'Słowacja', 'Turcja', 
                    'Wielka Brytania', 'Kosowo']
        countryMap = dict(zip(countryKeys, countryNewValues))
        countryMap
        dataset.geo = dataset.geo.replace(countryMap)

        wasteTypeKeys = dataset.waste.unique().tolist()
        wasteTypeNewValues = ['Suma odpadów', 'Odpady komunalne', 'Odpady budowlane i rozbiórkowe', 'Odpady przemysłowe',
                        'Odpady niebezpieczne', 'Inne odpady', 'Osad ściekowy', 'Odpady obojętne']
        wasteTypeMap = dict(zip(wasteTypeKeys, wasteTypeNewValues))
        wasteTypeKeys
        dataset.waste = dataset.waste.replace(wasteTypeMap)

        dataset = dataset.set_index(['geo','TIME_PERIOD'])

        dataset = dataset.loc[(dataset['value'] > 0) & (dataset['waste'] == 'Suma odpadów')]
        
        dataset = dataset.drop(['hazard','freq','waste','unit','nace_r2'], axis=1)

        return dataset.loc[[region]]
    
    except Exception as e:

        print(f"An error occurred while importing data: {e}")

    

 