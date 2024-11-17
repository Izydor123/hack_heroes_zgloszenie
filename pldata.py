import plotly.graph_objects as go
import plotly.express as px
import plotly.io as pio
import pandas as pd

def PLWasteCharts(route) -> list:
    ogolne = pd.read_csv(route)
    ogolne

    ogolne = ogolne.melt(id_vars=["Nazwa"], var_name="Rok", value_name="Masa wytworzonych odpadów(w tonach)")
    ogolne["Rok"] = ogolne["Rok"].astype(int)

    config = {
        'displayModeBar': False,    
        'scrollZoom': False,     
        'displaylogo': False,    
        'editable': False,        
        'showTips': False             
    }

    fig1 = go.Figure()
    for nazwa in ogolne['Nazwa'].unique():
        ogolne_nazwa = ogolne[ogolne['Nazwa'] == nazwa]
        fig1.add_trace(go.Scatter(x=ogolne_nazwa['Rok'], y=ogolne_nazwa['Masa wytworzonych odpadów(w tonach)'], mode='lines', name=nazwa))

   
    fig1.update_layout()
        xaxis_title="",
        yaxis_title="",
        annotations=[
        dict(
            text="Źródło danych: Baza danych lokalnych GUS",
            xref="paper", yref="paper",
            x=0, y=-0.3, showarrow=False,
            font=dict(size=10, color="black"))],
         legend=dict(
            orientation="h", 
            yanchor="top",
            y=-0.3,
            xanchor="center",
            x=0.5
        ),
        margin=dict(t=50, b=50),
        autosize=True,
        dragmode=False,
        hovermode=None

    fig1 = pio.to_html(fig1, full_html=False, config=config)

    

    fig2 = px.line(ogolne.groupby('Rok')['Masa wytworzonych odpadów(w tonach)'].sum().reset_index(), x='Rok', y='Masa wytworzonych odpadów(w tonach)')
    fig2.update_layout(
        xaxis_title="",
        yaxis_title="",
        annotations=[
        dict(
            text="Źródło danych: Baza danych lokalnych GUS",
            xref="paper", yref="paper",
            x=0, y=-0.2, showarrow=False,
            font=dict(size=10, color="black"))],
        autosize=True,
        margin=dict(t=50, b=50),
        dragmode=False,
        hovermode=None, 
        showlegend=False
    )
    fig2 = pio.to_html(fig2, full_html=False, config=config)

    return [fig1, fig2]
