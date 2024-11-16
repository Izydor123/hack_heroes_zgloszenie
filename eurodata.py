import pandasdmx as dmx
import pandas as pd

import plotly.graph_objects as go
import plotly.io as pio

def import_data() -> pd.DataFrame:
    try:

        dataRequest = dmx.Request('ESTAT')
        dataResponse = dataRequest.data(resource_id='ten00110')
        datasetToPrint = dataResponse.to_pandas().to_frame()

        datasetToPrint.reset_index(inplace=True)

        datasetToPrint = datasetToPrint.dropna()

        datasetToPrint.sort_values(by=['geo'])

        countryKeys = datasetToPrint.geo.unique().tolist()
        countryNewValues =  ['Albania', 'Austria', 'Bośnia i Hercegowina', 'Belgia', 'Bułgaria', 'Cypr', 'Czechy', 'Niemcy', 'Dania', 'Estonia', 'Grecja', 'Hiszpania', 'Kraje Unii Europejskiej(od 2020)',
                    'Finlandia', 'Francja', 'Chorwacja', 'Węgry', 'Irlandia', 'Islandia', 'Włochy', 'Liechtenstein', 'Litwa', 'Luksemburg', 'Łotwa', 'Czarnogóra', 
                    'Macedonia Północna', 'Malta', 'Holandia', 'Norwegia', 'Polska', 'Portugalia', 'Rumunia', 'Serbia', 'Szwecja', 'Słowenia', 'Słowacja', 'Turcja', 
                    'Wielka Brytania', 'Kosowo']
        countryMap = dict(zip(countryKeys, countryNewValues))
        countryMap
        datasetToPrint.geo = datasetToPrint.geo.replace(countryMap)

        wasteTypeKeys = datasetToPrint.waste.unique().tolist()
        wasteTypeNewValues = ['Suma odpadów', 'Odpady komunalne', 'Odpady budowlane i rozbiórkowe', 'Odpady przemysłowe',
                        'Odpady niebezpieczne', 'Inne odpady', 'Osad ściekowy', 'Odpady obojętne']
        wasteTypeMap = dict(zip(wasteTypeKeys, wasteTypeNewValues))
        wasteTypeKeys
        datasetToPrint.waste = datasetToPrint.waste.replace(wasteTypeMap)

        datasetToPrint = datasetToPrint.set_index(['geo','TIME_PERIOD'])
        datasetToPrint = datasetToPrint.drop(index=(['Kraje Unii Europejskiej(od 2020)','Kosowo', 'Liechtenstein']))

        datasetToPrint = datasetToPrint.loc[(datasetToPrint['value'] > 0) & (datasetToPrint['waste'] == 'Suma odpadów')]
        datasetToPrint = datasetToPrint.xs('2022',level='TIME_PERIOD')
        
        datasetToPrint = datasetToPrint.drop(['hazard','freq','waste','unit','nace_r2'], axis=1).reset_index()

        return datasetToPrint.rename(columns={"geo":"Region","value":"Suma odpadów wyprodukowana w 2022"})
    
    except Exception as e:

        print(f"An error occurred while importing data: {e}")

def data_chart(dataset) -> str:
    fig = go.Figure(
        data=[
            go.Bar(
                x=dataset['Region'], 
                y=dataset['Suma odpadów wyprodukowana w 2022'],
                marker=dict(color='skyblue'),
                hoverinfo="y"
            )
        ]
    )
    
    fig.update_layout(
        xaxis_title="",
        yaxis_title="",
        annotations=[
        dict(
            text="Źródło danych: Baza danych serwisu Eurostat",
            xref="paper", yref="paper",
            x=0, y=-0.9, showarrow=False,
            font=dict(size=10, color="black"))],
        dragmode=False,
        hovermode=None, 
        showlegend=False
    )

    config = {
        'displayModeBar': False,    
        'scrollZoom': False,     
        'displaylogo': False,    
        'editable': False,        
        'showTips': False             
    }

    chart_html = pio.to_html(fig, full_html=False, config=config)

    return chart_html

    
