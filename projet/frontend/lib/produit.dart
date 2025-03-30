class Produit {
  String nom;
  double prix;
  int stock;
  String categorie;

  Produit({
    required this.nom,
    required this.prix,
    required this.stock,
    required this.categorie,
  });

  void afficherDetails() {
    print('Produit: $nom, Prix: $prix, Stock: $stock, Catégorie: $categorie');
  }
}

class StockInsuffisantException implements Exception {
  String cause;
  StockInsuffisantException(this.cause);
}

class CommandeVideException implements Exception {
  String cause;
  CommandeVideException(this.cause);
}
