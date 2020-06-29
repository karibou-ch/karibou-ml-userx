# Calcul du score d'un produit (Attention, le produit est disponible sur plusieurs HUBs)
## sélection des meilleurs produits
1. un produit souvent acheté dans le présent est **très** valorisé
2. un produit souvent acheté dans le passé est **moins** valorisé
3. un produit acheté en petite quantité mais régulièrement est **très** valorisé
4. un produit acheté en grande quantité une dans très peu de commandes est **moyennement** valorisé 


## L’algorithme utilisé s'inspire du TF-IDF dédié à la recherche de termes
_La fréquence inverse de document (inverse document frequency) est une mesure de l'importance du terme dans l'ensemble des documents indexés. Dans le schéma TF-IDF, elle vise à donner <u>un poids plus important aux termes les moins fréquents, considérés comme plus discriminants</u>_. Pour cette raison on valorise l'inverse.


<img src="https://render.githubusercontent.com/render/math?math=\mathrm{tfidf_i,j} =   (tf_{i,j}) \cdot \log \frac{|D|}{|\{d_{j}: t_{i} \in d_{j}\}|}" />

* <img src="https://render.githubusercontent.com/render/math?math=|D|"/> : nombre total de documents dans le corpus ;
* <img src="https://render.githubusercontent.com/render/math?math=|\{d_{j} : t_{i} \in d_{j}\}|"/> : nombre de documents où le terme `t_{i}`  apparaît (c'est-à-dire <img src="https://render.githubusercontent.com/render/math?math=n_{i,j} \neq 0" />)

## Soit dans notre cas
On souhaite mesurer l'importance d'un produit dans l'ensemble des commandes de l'utilisateur. On donne un poids plus importants aux produits fréquemment acheté.

* Liste des produits **i** de 1 à N
* Liste des commandes **j** de 1 à N
* <img src="https://render.githubusercontent.com/render/math?math=|CU|"/> : nombre total de commandes pour un utilisateur ;
* <img src="https://render.githubusercontent.com/render/math?math=|\{CU_{j} : p_{i} \in CU_{j}\}|"/> : nombre de commandes de l'utilisateur où le produit `p_{i}`  apparaît
* Deux options pour `Pf(p_i)`
  * `Pf(p_i)`; = La fréquence d'achat d'un produit p_i dans toute les commandes *(exemple, 3x + 2x + 1x = 6x pour 3 commandes = 6/3)* 
  * `Pf(p_i)`; =  La fréquence d'achat d'un produit p_i dans la commande  / Nombre total de produits dans la commande *(exemple, 3/5 + 2/10 + 1/10 = 9 /10 )*

> déterminer la meilleure manière de calculter PF

<img src="https://render.githubusercontent.com/render/math?math=PfiCUf_{i,j} = (pf_{i,j}) \cdot \log \frac{|\{cu_{j}: p_{i} \in cu_{j}\}|}{|CU|}"/>

## Création d'un index pour l'utilisateur Anonymous
On considère un index qui appartient à un utilisateur neutre nommé Anonymous. Le score des produits de l'utilisateur Anonymous est produit par l'activité des commandes de l'ensemble des utilisateurs. Le score obtenu pour chaque produits, est considéré comme une référence normalisée de l'appréciation du produit.

## Propositions complémentaires
Il existe quelques cas de figures ou il n'est pas possible de faire des proposition de produits:
1. lorsque l'utilisateur n'a pas encore passé de commande
2. lorsque qu'il y a un nouveau produit

Pour ces cas, il faut quand même faire une proposition. 



* une habitude d'achat `H` individuelle est déterminée par le nombre de produits proposés pour une catégorie donnée
* on utilise une proposition Anonymous lorsque `H` est plus petite que le seuil Anonymous

# booster
On peut appliquer un booster devant notre score pour associer le score à une fonction du temps

* un produit acheté les ~3 derniers mois est boosté **(x2 -> x1)**
* ensuite il perd de la valeur dans le temps jusqu'à ~ 24 mois => (x1 -> x 1/2)
```
 booster = 1/ ( timeInMonth + 2)^0.7 x 1 / 0.3 
```
![image](https://user-images.githubusercontent.com/1422935/49075769-c494a880-f237-11e8-881e-ee6e230c54a5.png)
*  **variante:** un produit acheté les ~6 derniers mois est boosté **(x3 -> x1)**
```
 booster = 1/ ( timeInMonth + 2)^0.8 x 1 / 0.18 - 0.2 
```
![image](https://user-images.githubusercontent.com/1422935/49078252-cd887880-f23d-11e8-8701-ec859b41c436.png)

# booster de [HN](http://news.ycombinator.com/) 
```
 booster = 1/ ( timeInHours + 2)^1.8 x penalties
```
![image](https://user-images.githubusercontent.com/1422935/49076285-ed696d80-f238-11e8-9a6d-22ab63ccf969.png)

* avec une légère atténuation est ajouté sur la quantité de votes
```
 booster = booster * (votes - 1 )^.8
```


# Refs
* https://fr.wikipedia.org/wiki/TF-IDF 
* https://fr.wikipedia.org/wiki/Similarit%C3%A9_cosinus
* LateX https://www.overleaf.com/learn/latex/Integrals,_sums_and_limits
